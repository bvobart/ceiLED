extern crate linux_embedded_hal as hal;
extern crate pwm_pca9685 as pca9685;
use pca9685::{ Channel, Pca9685, SlaveAddr };

struct CeiledPca9685 { dev: Pca9685 }

impl CeiledPca9685 {
  pub fn new() -> Self {
    CeiledPca9685 { }
  }
}

impl CeiledDriver for CeiledPca9685 {
  pub fn setColor(&self, color: Color) {
    // TODO: implement setColor
  }

  pub fn setFade(&self, to: Color, millis: i32) {
    // TODO: implement setFade
  }
}