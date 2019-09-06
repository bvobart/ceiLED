use super::colors::{ Color };
use super::commands::{ Interpolator };
use super::cancellation::{ CancellationTokenSource };

use std::collections::HashMap;

/**
 * Basic functions that every CeiledDriver must have.
 */
pub trait CeiledDriver {
  // Gets the number of channels
  fn channels(&self) -> usize;
  fn name(&self) -> String;
  fn init(&mut self) -> Result<(), String>;
  fn off(&mut self) -> Result<(), String>;
  fn setColor(&mut self, channel: usize, color: Color) -> Result<(), String>;
  fn setColors(&mut self, colors: HashMap<usize, Color>) -> Result<(), String>;
  fn setFade(&mut self, channel: usize, to: Color, millis: usize, interp: Interpolator) -> Result<CancellationTokenSource, String>;
  fn setFades(&mut self, fadeMap: HashMap<usize, Color>, millis: usize, interp: Interpolator) -> Result<CancellationTokenSource, String>;
  
  // Gets the brightness level. 0 is minimum brightness, 255 is max brightness.
  fn getBrightness(&self) -> u8;
  // Sets the brightness level. 0 is minimum brightness, 255 is max brightness.
  fn setBrightness(&mut self, brightness: u8);
  // Gets the roomlight level. 0 is no roomlight adjustment, 255 is only roomlight.
  fn getRoomlight(&self) -> u8;
  // Sets the roomlight level. 0 is no roomlight adjustment, 255 is only roomlight.
  fn setRoomlight(&mut self, roomlight: u8);
  // Gets the flux level. See the colors::Color class for more info.
  fn getFlux(&self) -> u8;
  // Sets the flux level. See the colors::Color class for more info.
  fn setFlux(&mut self, flux: u8);
}
