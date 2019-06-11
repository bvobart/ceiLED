use super::colors::{ Color };
use super::commands::{ FadePattern };
use super::cancellation::{ CancellationTokenSource };

use std::collections::HashMap;

pub trait CeiledDriver {
  fn channels(&self) -> usize;
  fn init(&mut self) -> Result<(), &'static str>;
  fn off(&mut self) -> Result<(), &'static str>;
  fn setColor(&mut self, channel: usize, color: Color) -> Result<(), &'static str>;
  fn setColors(&mut self, colors: HashMap<usize, Color>) -> Result<(), &'static str>;
  fn setFade(&mut self, channel: usize, fade: FadePattern, millis: u32) -> Result<CancellationTokenSource, &'static str>;
  fn setFades(&mut self, fadeMap: HashMap<usize, FadePattern>, millis: u32) -> Result<CancellationTokenSource, &'static str>;
}
