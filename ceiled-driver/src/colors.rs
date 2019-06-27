use std::cmp::max;

pub const BLACK: Color = Color { red: 0, green: 0, blue: 0 };
pub const WHITE: Color = Color { red: 255, green: 255, blue: 255 };
pub const RED: Color = Color { red: 255, green: 0, blue: 0 };
pub const GREEN: Color = Color { red: 0, green: 255, blue: 0 };
pub const BLUE: Color = Color { red: 0, green: 0, blue: 255 };

pub const ROOMLIGHT: Color = Color { red: 255, green: 132, blue: 24 };
pub const FLUX1: Color = Color { red: 255, green: 246, blue: 237 };
pub const FLUX2: Color = Color { red: 255, green: 237, blue: 222 };
pub const FLUX3: Color = Color { red: 255, green: 228, blue: 206 };
pub const FLUX4: Color = Color { red: 255, green: 218, blue: 187 };
pub const FLUX5: Color = Color { red: 255, green: 206, blue: 166 };

#[derive(Clone, Debug)]
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
   * TODO: apply using screen blending method?
   * i.e. f(a, b) = 1 - (1 - a)(1 - b)
   */
  pub fn withRoomlight(&self, roomlight: u8) -> Self {
    if roomlight == 0 { return self.clone(); }
    if roomlight == 255 { return ROOMLIGHT };
    
    let factor = roomlight as f32 / 255.0;
    let red = max(self.red, (ROOMLIGHT.red as f32 * factor).round() as u8);
    let green = max(self.green, (ROOMLIGHT.green as f32 * factor).round() as u8);
    let blue = max(self.blue, (ROOMLIGHT.blue as f32 * factor).round() as u8);
    Color { red, green, blue }
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
