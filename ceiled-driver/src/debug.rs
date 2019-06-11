use super::ceiled::{ CeiledDriver };
use super::colors;
use super::colors::{ Color };
use super::commands::FadePattern;

use cancellation::{ CancellationTokenSource };
use crossterm::{ Colored, Crossterm, TerminalCursor };
use std::collections::HashMap;
use std::sync::{ Arc, Mutex };
use std::thread;
use std::thread::sleep;
use std::time::{ Duration };

static FPS: u32 = 60;

fn printColors(colors: &Vec<Color>, cursor: &TerminalCursor, printX: u16, printY: u16) {
  let (x, y) = cursor.pos();
  cursor.goto(printX, printY).expect("failed to set debug driver print location");

  for c in colors.clone() {
    print!("{}        ", Colored::Bg(crossterm::Color::Rgb{ r: c.red, g: c.green, b: c.blue }));
  }
  
  cursor.goto(x, y).expect("failed to move back to original cursor position");
}

pub struct DebugDriver {
  channels: usize,
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

  fn init(&mut self) -> Result<(), &'static str> {
    self.off()
  }
  
  fn off(&mut self) -> Result<(), &'static str> {
    let mut off = Vec::with_capacity(self.channels);
    for _ in 0..self.channels {
      off.push(colors::BLACK);
    }
    let mut colors = self.colors.lock().unwrap();
    *colors = off;
    printColors(&colors, &self.cursor.lock().unwrap(), self.printX, self.printY);
    Ok(())
  }

  fn setColor(&mut self, channel: usize, color: Color) -> Result<(), &'static str> {
    if channel >= self.channels { return Err("channel does not exist"); }
    let mut colors = self.colors.lock().unwrap();
    std::mem::replace(&mut colors[channel], color);
    printColors(&colors, &self.cursor.lock().unwrap(), self.printX, self.printY);
    Ok(())
  }

  fn setColors(&mut self, colors: HashMap<usize, Color>) -> Result<(), &'static str> {
    if colors.len() > self.channels { return Err("argument contains too much colors for the amount of channels"); }
    let mut selfColors = self.colors.lock().unwrap();
    for (channel, color) in colors {
      if channel >= self.channels { return Err("channel does not exist"); }
      std::mem::replace(&mut selfColors[channel], color);
    }
    printColors(&selfColors, &self.cursor.lock().unwrap(), self.printX, self.printY);
    Ok(())
  }

  fn setFade(&mut self, channel: usize, fade: FadePattern, millis: u32) -> Result<CancellationTokenSource, &'static str> {
    let mut map = HashMap::new();
    map.insert(channel, fade);
    self.setFades(map, millis)
  }

  fn setFades(&mut self, fadeMap: HashMap<usize, FadePattern>, millis: u32) -> Result<CancellationTokenSource, &'static str> {
    // apply only the fades for the channels that we actually support.
    let fadeMap: HashMap<usize, FadePattern> = fadeMap.iter().filter_map(|(channel, fade)| { 
      if channel < &self.channels { Some((*channel, fade.clone())) }
      else { None } 
    }).collect();

    let totalFrames = millis / 1000 * FPS;
    let nanosPerFrame = (1_000_000_000.0 / FPS as f64).round() as u64;

    let froms: HashMap<usize, Color> = fadeMap.keys().map(|channel| { (*channel, self.colors.lock().unwrap()[*channel].clone()) }).collect();
    let redDiffs: HashMap<usize, f64> = fadeMap.keys().map(|channel| { (*channel, fadeMap[channel].to.red as f64 - froms[channel].red as f64) }).collect();
    let greenDiffs: HashMap<usize, f64> = fadeMap.keys().map(|channel| { (*channel, fadeMap[channel].to.green as f64 - froms[channel].green as f64) }).collect();
    let blueDiffs: HashMap<usize, f64> = fadeMap.keys().map(|channel| { (*channel, fadeMap[channel].to.blue as f64 - froms[channel].blue as f64) }).collect();

    let selfColors = self.colors.clone();
    let cursor = self.cursor.clone();
    let px = self.printX.clone();
    let py = self.printY.clone();
    let cts = CancellationTokenSource::new();
    let ct = cts.token().clone();

    thread::spawn(move || {
      for i in 0..totalFrames {
        if ct.is_canceled() { break; }

        let mut colors = selfColors.lock().unwrap();
        for (channel, fade) in fadeMap.iter() {
          let from = &froms[channel];
          let baseColor = Color::new(
            (from.red as f64 + fade.interpolator.interpolate(redDiffs[channel], i + 1, totalFrames).round()) as u8,
            (from.green as f64 + fade.interpolator.interpolate(greenDiffs[channel], i + 1, totalFrames).round()) as u8,
            (from.blue as f64 + fade.interpolator.interpolate(blueDiffs[channel], i + 1, totalFrames).round()) as u8,
          );

          // TODO: adjust for roomlight, flux and brightness here?
          
          std::mem::replace(&mut colors[*channel], baseColor);
        }

        printColors(&colors, &cursor.lock().unwrap(), px, py);
        sleep(Duration::from_nanos(nanosPerFrame));
      }
    });

    Ok(cts)
  }
  
}