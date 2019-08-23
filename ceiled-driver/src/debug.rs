use super::ceiled::{ CeiledDriver };
use super::colors;
use super::colors::{ Color };
use super::commands::Interpolator;

use cancellation::{ CancellationTokenSource };
use crossterm::{ Colored, Crossterm, TerminalCursor };
use std::collections::HashMap;
use std::sync::{ Arc, Mutex };
use std::sync::atomic::{ AtomicU8, Ordering };
use std::thread;
use std::thread::sleep;
use std::time::{ Duration, SystemTime };

static FPS: u32 = 30;

fn printColors(colors: &Vec<Color>, cursor: &TerminalCursor, printX: u16, printY: u16) {
  cursor.save_position().expect("failed to save debug driver cursor location");
  cursor.goto(printX, printY).expect("failed to set debug driver print location");

  for c in colors.clone() {
    print!("{}        ", Colored::Bg(crossterm::Color::Rgb{ r: c.red, g: c.green, b: c.blue }));
  }
  
  cursor.reset_position().expect("failed to reset debug driver cursor position");
}

pub struct DebugDriver {
  channels: usize,
  brightness: Arc<AtomicU8>,
  flux: Arc<AtomicU8>,
  roomlight: Arc<AtomicU8>,
  colors: Arc<Mutex<Vec<Color>>>,

  cursor: Arc<Mutex<TerminalCursor>>,
  printX: u16,
  printY: u16,
}

impl DebugDriver {
  pub fn new(cterm: &Crossterm, channels: usize) -> Self {
    let cursor = cterm.cursor();
    let (xmax, ymax) = cterm.terminal().terminal_size();
    let mut colors = Vec::new();
    for _ in 0..channels { colors.push(colors::BLACK) }
    DebugDriver { 
      channels,
      brightness: Arc::new(AtomicU8::new(255)),
      flux: Arc::new(AtomicU8::new(0)),
      roomlight: Arc::new(AtomicU8::new(0)),

      colors: Arc::new(Mutex::new(colors)), 
      cursor: Arc::new(Mutex::new(cursor)),
      printX: xmax - 24,
      printY: ymax, 
    }
  }
}

impl CeiledDriver for DebugDriver {
  fn channels(&self) -> usize {
    self.channels
  }

  fn init(&mut self) -> Result<(), String> {
    // TODO: make cool startup routine :P
    self.off()
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
  
  fn off(&mut self) -> Result<(), String> {
    let mut off = Vec::with_capacity(self.channels);
    for _ in 0..self.channels {
      off.push(colors::BLACK);
    }
    let mut colors = self.colors.lock().unwrap();
    *colors = off;
    printColors(&colors, &self.cursor.lock().unwrap(), self.printX, self.printY);
    Ok(())
  }

  fn setColor(&mut self, channel: usize, color: Color) -> Result<(), String> {
    if channel >= self.channels { return Err(format!("channel does not exist: {}, max: {}", channel, self.channels)); }
    let adjustedColor = color
      .withRoomlight(self.getRoomlight())
      .withFlux(self.getFlux())
      .withBrightness(self.getBrightness());
    
    let mut colors = self.colors.lock().unwrap();
    std::mem::replace(&mut colors[channel], adjustedColor);
    printColors(&colors, &self.cursor.lock().unwrap(), self.printX, self.printY);
    Ok(())
  }

  fn setColors(&mut self, colors: HashMap<usize, Color>) -> Result<(), String> {
    if colors.len() > self.channels { return Err(format!("too many colors for the amount of channels: {}, max: {}", colors.len(), self.channels )); }
    let mut selfColors = self.colors.lock().unwrap();
    for (channel, color) in colors {
      if channel >= self.channels { return Err(format!("channel does not exist: {}, max: {}", channel, self.channels)); }
      let adjustedColor = color
        .withRoomlight(self.getRoomlight())
        .withFlux(self.getFlux())
        .withBrightness(self.getBrightness());
      std::mem::replace(&mut selfColors[channel], adjustedColor);
    }
    printColors(&selfColors, &self.cursor.lock().unwrap(), self.printX, self.printY);
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
    
    let selfColors = self.colors.clone();
    let brightness = self.brightness.clone();
    let roomlight = self.roomlight.clone();
    let flux = self.flux.clone();
    let cursor = self.cursor.clone();
    let px = self.printX.clone();
    let py = self.printY.clone();
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
        
        for (channel, _) in fadeMap.iter() {
          let from = &froms[channel];
          let baseColor = Color::new(
            (from.red as f64 + interp.interpolate(redDiffs[channel], i + 1, totalFrames).round()) as u8,
            (from.green as f64 + interp.interpolate(greenDiffs[channel], i + 1, totalFrames).round()) as u8,
            (from.blue as f64 + interp.interpolate(blueDiffs[channel], i + 1, totalFrames).round()) as u8,
          );
          let adjustedColor = baseColor.withRoomlight(rl).withFlux(f).withBrightness(b);
          std::mem::replace(&mut colors[*channel], adjustedColor);
        }

        printColors(&colors, &cursor.lock().unwrap(), px, py);
      }
    });

    Ok(cts)
  }
  
}