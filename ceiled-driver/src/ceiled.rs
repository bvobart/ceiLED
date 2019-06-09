use super::colors::{ Color };
use super::commands::{ Interpolator };
use super::cancellation::{ CancellationTokenSource };

pub trait CeiledDriver {
  fn channels(&self) -> usize;
  fn init(&mut self) -> Result<(), &'static str>;
  fn off(&mut self) -> Result<(), &'static str>;
  fn setColor(&mut self, channel: usize, color: Color) -> Result<(), &'static str>;
  fn setColors(&mut self, colors: Vec<Color>) -> Result<(), &'static str>;
  fn setFade(&mut self, channel: usize, to: Color, millis: u32, interp: Interpolator) -> Result<CancellationTokenSource, &'static str>;
  // fn setFades(&self, )
}
