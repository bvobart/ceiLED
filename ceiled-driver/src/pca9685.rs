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


pub struct CeiledPca9685 { 
  channels: usize, // NOTE: colour channels. Number of pins used is thus channels * 3, see toPwmChannel
  brightness: Arc<AtomicU8>,
  flux: Arc<AtomicU8>,
  roomlight: Arc<AtomicU8>,

  pwm: Arc<Mutex<Pca9685<I2cdev>>>
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

use ChannelPin::*;

impl CeiledPca9685 {
  pub fn new(channels: usize) -> Result<Self, String> {
    let i2c = match I2cdev::new("/dev/i2c-5") {
      Ok(dev) => dev,
      Err(err) => return Err(format!("failed to initialise pca9685 driver: {}", err.description()))
    };

    let address = SlaveAddr::default();
    let mut pwm = Pca9685::new(i2c, address);
    checkErr(pwm.set_prescale(3), "failed to set pca9685 driver pwm frequency".to_string())?;
    checkErr(pwm.enable(), "failed to enable pca9685 driver:".to_string())?;

    Ok(CeiledPca9685 {
      channels,
      brightness: Arc::new(AtomicU8::new(255)),
      flux: Arc::new(AtomicU8::new(0)),
      roomlight: Arc::new(AtomicU8::new(0)),
      pwm: Arc::new(Mutex::new(pwm))
    })
  }
}

impl CeiledDriver for CeiledPca9685 {
  fn channels(&self) -> usize {
    self.channels
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
    checkErr(pwm.set_channel_full_off(Channel::All), "pca9685 failed to turn off".to_string())
  }

  fn setColor(&mut self, channel: usize, color: Color) -> Result<(), String> {
    let mut pwm = self.pwm.lock().unwrap();
    checkErr(pwm.set_channel_on(toPwmChannel(channel, RED), 0), "failed to set duty cycle for red pin on channel ".to_owned() + &channel.to_string())?;
    checkErr(pwm.set_channel_off(toPwmChannel(channel, RED), color.red as u16 * 16), "failed to set duty cycle for red pin on channel ".to_owned() + &channel.to_string())?;    
    checkErr(pwm.set_channel_on(toPwmChannel(channel, GREEN), 0), "failed to set duty cycle for green pin on channel ".to_owned() + &channel.to_string())?;
    checkErr(pwm.set_channel_off(toPwmChannel(channel, GREEN), color.green as u16 * 16), "failed to set duty cycle for green pin on channel ".to_owned() + &channel.to_string())?;    
    checkErr(pwm.set_channel_on(toPwmChannel(channel, BLUE), 0), "failed to set duty cycle for blue pin on channel ".to_owned() + &channel.to_string())?;
    checkErr(pwm.set_channel_off(toPwmChannel(channel, BLUE), color.blue as u16 * 16), "failed to set duty cycle for blue pin on channel ".to_owned() + &channel.to_string())?;    
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
    // TODO: implement setFades
    let cts = CancellationTokenSource::new();
    // let ct = cts.token().clone();
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
