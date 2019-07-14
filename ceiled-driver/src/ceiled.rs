use super::colors::{ Color };
use super::commands::{ Interpolator };
use super::cancellation::{ CancellationTokenSource };

use std::collections::HashMap;

/**
 * Basic functions that every CeiledDriver must have.
 */
pub trait CeiledDriver {
  fn channels(&self) -> usize;
  fn init(&mut self) -> Result<(), String>;
  fn off(&mut self) -> Result<(), String>;
  fn setColor(&mut self, channel: usize, color: Color) -> Result<(), String>;
  fn setColors(&mut self, colors: HashMap<usize, Color>) -> Result<(), String>;
  fn setFade(&mut self, channel: usize, to: Color, millis: u32, interp: Interpolator) -> Result<CancellationTokenSource, String>;
  fn setFades(&mut self, fadeMap: HashMap<usize, Color>, millis: u32, interp: Interpolator) -> Result<CancellationTokenSource, String>;
}

/**
 * If a CeiledDriver implements the Dimmable trait, then it is possible to set a brightness level
 * on the driver. 0 is minimum brightness, 255 is max brightness.
 * A driver that implements this trait should apply the brightness when it displays its colors,
 * i.e. in the setColor(s) and setFade(s) methods.
 */
pub trait Dimmable: CeiledDriver {
  fn getBrightness(&self) -> u8;
  fn setBrightness(&mut self, brightness: u8);
}

/**
 * If a CeiledDriver implements this trait, then the driver should blend the colors it displays
 * with the roomlight color. 0 is no roomlight adjustment, 255 is only roomlight.
 * Roomlightable didn't really work for a name xD
 */
pub trait RoomlightSupport: CeiledDriver {
  fn getRoomlight(&self) -> u8;
  fn setRoomlight(&mut self, roomlight: u8);
}

/**
 * If a CeiledDriver implements this trait, then the driver should multiply the colors it displays
 * with the flux colors, depending on the flux setting. See the super::colors::Color class for more info.
 */
pub trait Fluxable: CeiledDriver {
  fn getFlux(&self) -> u8;
  fn setFlux(&mut self, flux: u8);
}
