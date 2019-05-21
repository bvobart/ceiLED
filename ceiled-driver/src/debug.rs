use super::ceiled::{ CeiledDriver };
use super::Colors;
use super::Colors::{ Color };

use crossterm::{ Colored, Crossterm, TerminalCursor };

static FPS: u8 = 60;

pub struct DebugDriver {
  colors: Vec<Color>,
  cursor: TerminalCursor
}

impl DebugDriver {
  pub fn new(channels: usize) -> Self {
    let cterm = Crossterm::new();
    let cursor = cterm.cursor();
    let mut colors = Vec::new();
    for _ in 0..channels { colors.push(Colors::BLACK)}
    DebugDriver { colors, cursor }
  }

  fn printColors(&mut self) {
    self.cursor.move_up(1);
    for c in self.colors.clone() {
      print!("{}       ", Colored::Bg(crossterm::Color::Rgb{ r: c.red, g: c.green, b: c.blue }));
    }
    println!("");
  }
}

impl CeiledDriver for DebugDriver {
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