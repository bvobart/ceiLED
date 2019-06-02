use super::ceiled::{ CeiledDriver };
use super::Colors;
use super::Colors::{ Color };

use crossterm::{ Colored, Crossterm, TerminalCursor };

static FPS: u8 = 60;

pub struct DebugDriver {
  channels: usize,
  colors: Vec<Color>,
  cursor: TerminalCursor,
  printX: u16,
  printY: u16,
}

impl DebugDriver {
  pub fn new(cterm: &Crossterm, channels: usize) -> Self {
    let cursor = cterm.cursor();
    let (xmax, ymax) = cterm.terminal().terminal_size();
    let mut colors = Vec::new();
    for _ in 0..channels { colors.push(Colors::BLACK) }
    DebugDriver { 
      channels,
      colors, 
      cursor,
      printX: xmax - 24,
      printY: ymax, 
    }
  }

  fn printColors(&mut self) {
    let (x, y) = self.cursor.pos();
    self.cursor.goto(self.printX, self.printY).expect("failed to set debug driver print location");

    for c in self.colors.clone() {
      print!("{}        ", Colored::Bg(crossterm::Color::Rgb{ r: c.red, g: c.green, b: c.blue }));
    }
    
    self.cursor.goto(x, y).expect("failed to move back to original cursor position");
  }
}

impl CeiledDriver for DebugDriver {
  fn channels(&self) -> usize {
    self.channels
  }

  fn init(&mut self) {
    self.off();
  }
  
  fn off(&mut self) {
    let mut off = Vec::with_capacity(self.colors.len());
    for _ in 0..self.colors.len() {
      off.push(Colors::BLACK);
    }
    self.colors = off;
    self.printColors();
  }

  fn setColor(&mut self, channel: usize, color: Color) {
    if channel < self.colors.len() {
      std::mem::replace(&mut self.colors[channel], color);
      self.printColors();
    }
  }

  fn setColors(&mut self, colors: Vec<Color>) {
    self.colors = colors;
    self.printColors();
  }

  fn setFade(&mut self, channel: usize, to: Color, millis: u32) {
    // TODO: implement
  }
}