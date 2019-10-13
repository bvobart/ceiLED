use std::cmp::max;

pub const BLACK: Color = Color { red: 0, green: 0, blue: 0 };
pub const WHITE: Color = Color { red: 255, green: 255, blue: 255 };
pub const RED: Color = Color { red: 255, green: 0, blue: 0 };
pub const GREEN: Color = Color { red: 0, green: 255, blue: 0 };
pub const BLUE: Color = Color { red: 0, green: 0, blue: 255 };

pub const ROOMLIGHT: Color = Color { red: 255, green: 142, blue: 64 };
pub const FLUX1: Color = Color { red: 255, green: 246, blue: 237 };
pub const FLUX2: Color = Color { red: 255, green: 237, blue: 222 };
pub const FLUX3: Color = Color { red: 255, green: 228, blue: 206 };
pub const FLUX4: Color = Color { red: 255, green: 218, blue: 187 };
pub const FLUX5: Color = Color { red: 255, green: 206, blue: 166 };

#[derive(Clone, Debug,PartialEq)]
pub struct Color { pub red: u8, pub green: u8, pub blue: u8 }

/**
 * The brightness, roomlight and flux adjustments can best be done in this order:
 * 1. Roomlight
 * 2. Flux
 * 3. Brightness
 */
impl Color {
  pub fn new(red: u8, green: u8, blue: u8) -> Self {
    Color { red, green, blue }
  }

  /**
   * Multiplies this color with anther color, returning new color as result.
   */
  pub fn multiply(&self, color: &Color) -> Self {
    Color {
      red: (self.red as f32 * color.red as f32 / 255.0).round() as u8,
      green: (self.green as f32 * color.green as f32 / 255.0).round() as u8,
      blue: (self.blue as f32 * color.blue as f32 / 255.0).round() as u8
    }
  }

  pub fn blend(&self, color: &Color, factor: f64) -> Self {
    let fracSelfRed = self.red as f64 / 255.0;
    let fracSelfGreen = self.green as f64 / 255.0;
    let fracSelfBlue = self.blue as f64 / 255.0;

    let fracColorRed = color.red as f64 / 255.0;
    let fracColorGreen = color.green as f64 / 255.0;
    let fracColorBlue = color.blue as f64 / 255.0;

    let red = ((1.0 - factor) * fracSelfRed * fracSelfRed + factor * fracColorRed * fracColorRed).sqrt() * 255.0;
    let green = ((1.0 - factor) * fracSelfGreen * fracSelfGreen + factor * fracColorGreen * fracColorGreen).sqrt() * 255.0;
    let blue = ((1.0 - factor) * fracSelfBlue * fracSelfBlue + factor * fracColorBlue * fracColorBlue).sqrt() * 255.0;

    Color { red: red.round() as u8, green: green.round() as u8, blue: blue.round() as u8 }
  }

  /**
   * Applies brightness correction to a color.
   */
  pub fn withBrightness(&self, brightness: u8) -> Self {
    if brightness == 0 { return BLACK };
    if brightness == 255 { return self.clone() };

    let factor = brightness as f32 / 255.0;
    let red = (self.red as f32 * factor).round() as u8;
    let green = (self.green as f32 * factor).round() as u8;
    let blue = (self.blue as f32 * factor).round() as u8;
    Color { red, green, blue }
  }

  /**
   * Applies roomlight correction to a color.
   * Does so by blending (see https://stackoverflow.com/a/29321264) self with the roomlight colour
   * and then capping that to the brightness of the brightest component in self.
   * That way black is black and roomlight is roomlight, yet everything in between blends smoothly.
   */
  pub fn withRoomlight(&self, roomlight: u8) -> Self {
    let brightest = max(self.red, max(self.green, self.blue));
    let factor = roomlight as f64 / 255.0;
    self.blend(&ROOMLIGHT, factor).withBrightness(brightest)
  }

  /**
   * Factory method to apply flux to a color.
   * Flux has 6 levels: 0 being off, 5 being maximum blue light reduction.
   */
  pub fn withFlux(&self, flux: u8) -> Self {
    match flux {
      0 => self.clone(),
      1 => self.multiply(&FLUX1),
      2 => self.multiply(&FLUX2),
      3 => self.multiply(&FLUX3),
      4 => self.multiply(&FLUX4),
      _ => self.multiply(&FLUX5)
    }
  }
}

#[cfg(test)]
mod ColorTests {
  use super::*;

  #[test]
  fn testWithRoomlight() {
    // Black stays black
    assert_eq!(BLACK.withRoomlight(0), BLACK);
    assert_eq!(BLACK.withRoomlight(64), BLACK);
    assert_eq!(BLACK.withRoomlight(128), BLACK);
    assert_eq!(BLACK.withRoomlight(255), BLACK);

    assert_eq!(RED.withRoomlight(0), RED);
    assert_eq!(RED.withRoomlight(255), ROOMLIGHT);
    assert_eq!(GREEN.withRoomlight(0), GREEN);
    assert_eq!(GREEN.withRoomlight(255), ROOMLIGHT);
    assert_eq!(BLUE.withRoomlight(0), BLUE);
    assert_eq!(BLUE.withRoomlight(255), ROOMLIGHT);
  }
}
