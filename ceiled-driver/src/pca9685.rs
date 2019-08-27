extern crate linux_embedded_hal as hal;
extern crate pwm_pca9685 as pca9685;
use hal::I2cdev;
use pca9685::{ Channel, Error as PwmError, Pca9685, SlaveAddr };
use hal::i2cdev::linux::LinuxI2CError;

use super::cancellation::{ CancellationTokenSource };
use super::ceiled::{ CeiledDriver };
use super::colors;
use super::colors::{ Color };
use super::commands::Interpolator;

use std::collections::HashMap;
use std::error::Error;
use std::sync::{ Arc, Mutex };
use std::sync::atomic::{ AtomicU8, Ordering };
use std::thread;
use std::thread::sleep;
use std::time::{ Duration, SystemTime };

static FPS: u32 = 90;

pub struct CeiledPca9685 { 
  channels: usize, // NOTE: colour channels. Number of pins used is thus channels * 3, see toPwmChannel
  brightness: Arc<AtomicU8>,
  flux: Arc<AtomicU8>,
  roomlight: Arc<AtomicU8>,

  pwm: Arc<Mutex<Pca9685<I2cdev>>>,
  colors: Arc<Mutex<Vec<Color>>>,
}

enum ChannelPin {
  RED,
  GREEN,
  BLUE,
}

fn toPwmChannel(cchannel: usize, pin: ChannelPin) -> Channel {
  match (cchannel, pin) {
    (0, RED) => Channel::C0,
    (0, GREEN) => Channel::C1,
    (0, BLUE) => Channel::C2,
    (1, RED) => Channel::C3,
    (1, GREEN) => Channel::C4,
    (1, BLUE) => Channel::C5,    
    (2, RED) => Channel::C6,
    (2, GREEN) => Channel::C7,
    (2, BLUE) => Channel::C8,
    (3, RED) => Channel::C9,
    (3, GREEN) => Channel::C10,
    (3, BLUE) => Channel::C11,
    (4, RED) => Channel::C12,
    (4, GREEN) => Channel::C13,
    (4, BLUE) => Channel::C14,
    _ => Channel::All,
  }
}

fn checkErr(err: Result<(), PwmError<LinuxI2CError>>, message: String) -> Result<(), String> {
  match err {
    Ok(()) => Ok(()),
    Err(err) => Err(format!("{}: {:?}", message, err))
  }
}

fn printErr(err: Result<(), String>) {
  match err {
    Ok(()) => {},
    Err(err) => println!("{}", err),
  }
}

use ChannelPin::*;

impl CeiledPca9685 {
  /**
   * Opens a connection to a PCA9685 PWM controller at the location specified by `dev`.
   * There are 15 PWM channels on the device, thus allowing for a maximum of 5 RGB led strips.
   */
  pub fn new(location: String, channels: usize) -> Result<Self, String> {
    let i2c = match I2cdev::new(location.clone()) {
      Ok(i2c) => i2c,
      Err(err) => return Err(format!("failed to initialise i2c device at {}: {}", location, err.description()))
    };

    let address = SlaveAddr::default();
    let mut pwm = Pca9685::new(i2c, address);
    checkErr(pwm.set_prescale(3), "failed to set pca9685 driver pwm frequency".to_string())?;
    checkErr(pwm.enable(), "failed to enable pca9685 driver:".to_string())?;

    let mut colors = Vec::new();
    for _ in 0..channels { colors.push(colors::BLACK) }

    Ok(CeiledPca9685 {
      channels,
      brightness: Arc::new(AtomicU8::new(255)),
      flux: Arc::new(AtomicU8::new(0)),
      roomlight: Arc::new(AtomicU8::new(0)),
      pwm: Arc::new(Mutex::new(pwm)),
      colors: Arc::new(Mutex::new(colors)),
    })
  }
}

impl CeiledDriver for CeiledPca9685 {
  fn channels(&self) -> usize {
    self.channels
  }

  fn name(&self) -> String {
    "pca9685".to_owned()
  }
  
  fn init(&mut self) -> Result<(), String> {
    // TODO: make cool startup routine :P
    let mut map = HashMap::new();
    for i in 0..self.channels {
      map.insert(i, colors::BLACK);
    }
    self.setColors(map)
  }

  fn off(&mut self) -> Result<(), String> {
    let mut pwm = self.pwm.lock().unwrap();
    checkErr(pwm.set_channel_on(Channel::All, 0), "pca9685 failed to turn off".to_string())?;
    checkErr(pwm.set_channel_full_off(Channel::All), "pca9685 failed to turn off".to_string())
  }

  fn setColor(&mut self, channel: usize, color: Color) -> Result<(), String> {
    let color = color
      .withRoomlight(self.getRoomlight())
      .withFlux(self.getFlux())
      .withBrightness(self.getBrightness());
    
    let mut pwm = self.pwm.lock().unwrap();
    checkErr(pwm.set_channel_on(toPwmChannel(channel, RED), 0), "failed to set duty cycle for red pin on channel ".to_owned() + &channel.to_string())?;
    checkErr(pwm.set_channel_off(toPwmChannel(channel, RED), color.red as u16 * 16), "failed to set duty cycle for red pin on channel ".to_owned() + &channel.to_string())?;    
    checkErr(pwm.set_channel_on(toPwmChannel(channel, GREEN), 0), "failed to set duty cycle for green pin on channel ".to_owned() + &channel.to_string())?;
    checkErr(pwm.set_channel_off(toPwmChannel(channel, GREEN), color.green as u16 * 16), "failed to set duty cycle for green pin on channel ".to_owned() + &channel.to_string())?;    
    checkErr(pwm.set_channel_on(toPwmChannel(channel, BLUE), 0), "failed to set duty cycle for blue pin on channel ".to_owned() + &channel.to_string())?;
    checkErr(pwm.set_channel_off(toPwmChannel(channel, BLUE), color.blue as u16 * 16), "failed to set duty cycle for blue pin on channel ".to_owned() + &channel.to_string())?;    
    
    let mut colors = self.colors.lock().unwrap();
    std::mem::replace(&mut colors[channel], color);

    Ok(())
  }

  fn setColors(&mut self, colors: HashMap<usize, Color>) -> Result<(), String> {
    for (channel, color) in colors {
      self.setColor(channel, color)?;
    }
    Ok(())
  }


  fn setFade(&mut self, channel: usize, to: Color, millis: u32, interp: Interpolator) -> Result<CancellationTokenSource, String> {
    let mut map = HashMap::new();
    map.insert(channel, to);
    self.setFades(map, millis, interp)
  }

  fn setFades(&mut self, fadeMap: HashMap<usize, Color>, millis: u32, interp: Interpolator) -> Result<CancellationTokenSource, String> {
    // apply only the fades for the channels that we actually support.
    let fadeMap: HashMap<usize, Color> = fadeMap.iter().filter_map(|(channel, color)| { 
      if channel < &self.channels { Some((*channel, color.clone())) }
      else { None } 
    }).collect();

    let totalFrames = (millis as f64 / 1000.0 * FPS as f64).round() as u32;
    let nanosPerFrame = (1_000_000_000.0 / FPS as f64).round() as u64;
    
    let currentColors = self.colors.lock().unwrap();
    let froms: HashMap<usize, Color> = fadeMap.keys().map(|channel| { (*channel, currentColors[*channel].clone()) }).collect();
    let redDiffs: HashMap<usize, f64> = fadeMap.keys().map(|channel| { (*channel, fadeMap[channel].red as f64 - froms[channel].red as f64) }).collect();
    let greenDiffs: HashMap<usize, f64> = fadeMap.keys().map(|channel| { (*channel, fadeMap[channel].green as f64 - froms[channel].green as f64) }).collect();
    let blueDiffs: HashMap<usize, f64> = fadeMap.keys().map(|channel| { (*channel, fadeMap[channel].blue as f64 - froms[channel].blue as f64) }).collect();
    
    let selfPwm = self.pwm.clone();
    let selfColors = self.colors.clone();
    let brightness = self.brightness.clone();
    let roomlight = self.roomlight.clone();
    let flux = self.flux.clone();
    let cts = CancellationTokenSource::new();
    let ct = cts.token().clone();

    thread::spawn(move || {
      let mut frameStartTime = SystemTime::now();
      for i in 0..totalFrames {
        if i > 0 {
          let elapsed = frameStartTime.elapsed().unwrap().as_nanos();
          if elapsed < nanosPerFrame as u128 {
            let nsToSleep = nanosPerFrame as u128 - elapsed;
            sleep(Duration::from_nanos(nsToSleep as u64)); 
          }
        }
        frameStartTime = SystemTime::now();

        if ct.is_canceled() { break; }

        let b = brightness.load(Ordering::Relaxed);
        let f = flux.load(Ordering::Relaxed);
        let rl = roomlight.load(Ordering::Relaxed);
        let mut colors = selfColors.lock().unwrap();
        let mut pwm = selfPwm.lock().unwrap();
        
        for (channel, _) in fadeMap.iter() {
          let from = &froms[channel];
          let baseColor = Color::new(
            (from.red as f64 + interp.interpolate(redDiffs[channel], i + 1, totalFrames).round()) as u8,
            (from.green as f64 + interp.interpolate(greenDiffs[channel], i + 1, totalFrames).round()) as u8,
            (from.blue as f64 + interp.interpolate(blueDiffs[channel], i + 1, totalFrames).round()) as u8,
          );
          let adjustedColor = baseColor.withRoomlight(rl).withFlux(f).withBrightness(b);

          printErr(checkErr(pwm.set_channel_on(toPwmChannel(*channel, RED), 0), "failed to set duty cycle for red pin on channel ".to_owned() + &channel.to_string()));
          printErr(checkErr(pwm.set_channel_off(toPwmChannel(*channel, RED), adjustedColor.red as u16 * 16), "failed to set duty cycle for red pin on channel ".to_owned() + &channel.to_string()));    
          printErr(checkErr(pwm.set_channel_on(toPwmChannel(*channel, GREEN), 0), "failed to set duty cycle for green pin on channel ".to_owned() + &channel.to_string()));
          printErr(checkErr(pwm.set_channel_off(toPwmChannel(*channel, GREEN), adjustedColor.green as u16 * 16), "failed to set duty cycle for green pin on channel ".to_owned() + &channel.to_string()));    
          printErr(checkErr(pwm.set_channel_on(toPwmChannel(*channel, BLUE), 0), "failed to set duty cycle for blue pin on channel ".to_owned() + &channel.to_string()));
          printErr(checkErr(pwm.set_channel_off(toPwmChannel(*channel, BLUE), adjustedColor.blue as u16 * 16), "failed to set duty cycle for blue pin on channel ".to_owned() + &channel.to_string()));

          std::mem::replace(&mut colors[*channel], adjustedColor);
        }
      }
    });

    Ok(cts)
  }
  

  fn getBrightness(&self) -> u8 {
    self.brightness.load(Ordering::Relaxed)
  }

  fn setBrightness(&mut self, brightness: u8) {
    self.brightness.store(brightness, Ordering::Relaxed);
  }

  fn getRoomlight(&self) -> u8 {
    self.roomlight.load(Ordering::Relaxed)
  }

  fn setRoomlight(&mut self, roomlight: u8) {
    self.roomlight.store(roomlight, Ordering::Relaxed);
  }

  fn getFlux(&self) -> u8 {
    self.flux.load(Ordering::Relaxed)
  }

  fn setFlux(&mut self, flux: u8) {
    self.flux.store(flux, Ordering::Relaxed);
  }
}
