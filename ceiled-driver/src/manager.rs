use super::ceiled::{ CeiledDriver };
use super::command::{ Command, Interpolator, Pattern, Target, Setting };
use Pattern::*;
use Target::*;
use Setting::*;

use cancellation::{ CancellationTokenSource };
use std::collections::HashMap;

/**
 * DriverManager acts as a generic wrapper around a driver, keeping track of long running operations that may need to be cancelled,
 * and providing an implementation for applying a Command to the driver.
 */
pub struct DriverManager {
  driver: Box<CeiledDriver + Send>,
  toBeCancelled: Option<CancellationTokenSource>,
}

/**
 * Static methods, i.e. DriverManager::new(driver)
 */
impl DriverManager {
  pub fn new(driver: Box<CeiledDriver + Send>) -> Self {
    DriverManager {
      driver,
      toBeCancelled: None
    }
  }
}

/**
 * Instance methods.
 */
impl DriverManager {
  pub fn get(&mut self) -> &mut Box<CeiledDriver + Send> {
    &mut self.driver
  }

  fn cancelCurrent(&mut self) {
    match &self.toBeCancelled {
      None => {},
      Some(cts) => {
        cts.cancel();
        self.toBeCancelled = None;
      }
    }
  }
}

/**
 * Instance methods for executing a command.
 */
impl DriverManager {
  pub fn execute(&mut self, cmd: &Command) -> Result<Option<String>, String> {
    match cmd {
      Command::GetSetting(_, setting) => self.executeGetSetting(setting),
      Command::SetSetting(_, setting, value) => self.executeSetSetting(setting, *value),
      Command::SetPattern(_, targetPatterns) => self.executeSetPattern(targetPatterns),
    }
  }

  fn executeGetSetting(&self, setting: &Setting) -> Result<Option<String>, String> {
    match setting {
      Brightness => Ok(Some(self.driver.getBrightness().to_string())),
      Roomlight => Ok(Some(self.driver.getRoomlight().to_string())),
      Flux => Ok(Some(self.driver.getFlux().to_string())),
    }
  }

  fn executeSetSetting(&mut self, setting: &Setting, value: u8) -> Result<Option<String>, String> {
    match setting {
      Brightness => { 
        self.driver.setBrightness(value);
        Ok(None)
      },
      Roomlight => { 
        self.driver.setRoomlight(value);
        Ok(None)
      },
      Flux => { 
        self.driver.setFlux(value);
        Ok(None)
      },
    }
  }

  fn executeSetPattern(&mut self, targetPatterns: &Vec<(Target, Pattern)>) -> Result<Option<String>, String> {
    let mut solidColors = HashMap::new();
    let mut fadeColors = HashMap::new();
    let mut longestMillis = 0;
    let mut fadeInterp = &Interpolator::Linear;

    for (target, pattern) in targetPatterns {
      match target {
        All => match pattern {
          Solid(color) => for ch in 0..self.driver.channels() { solidColors.insert(ch, color.clone()); },
          Fade(color, millis, interp) => {
            longestMillis = *millis;
            fadeInterp = interp;
            for ch in 0..self.driver.channels() { 
              fadeColors.insert(ch, color.clone()); 
            }
          },
        },

        One(channel) => match pattern {
          Solid(color) => { solidColors.insert(*channel, color.clone()); },
          Fade(color, millis, interp) => {
            longestMillis = *millis;
            fadeInterp = interp;
            fadeColors.insert(*channel, color.clone());
          },
        },

        Multiple(channels) => match pattern {
          Solid(color) => for ch in channels { solidColors.insert(*ch, color.clone()); },
          Fade(color, millis, interp) => {
            longestMillis = *millis;
            fadeInterp = interp;
            for ch in channels { 
              fadeColors.insert(*ch, color.clone()); 
            }
          },
        },
      }
    }

    self.cancelCurrent();
    self.driver.setColors(solidColors)?;
    let cts = self.driver.setFades(fadeColors, longestMillis, fadeInterp.clone())?;
    self.toBeCancelled = Some(cts);

    Ok(None)
  }
}
