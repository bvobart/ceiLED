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
      Command::GetSetting(id, setting) => self.executeGetSetting(*id, setting),
      Command::SetSetting(id, setting, value) => self.executeSetSetting(*id, setting, *value),
      Command::SetPattern(id, targetPatterns) => self.executeSetPattern(*id, targetPatterns),
    }
  }

  fn executeGetSetting(&self, id: Option<usize>, setting: &Setting) -> Result<Option<String>, String> {
    match setting {
      Brightness => Ok(Some(idString(id) + &self.driver.getBrightness().to_string())),
      Roomlight => Ok(Some(idString(id) + &self.driver.getRoomlight().to_string())),
      Flux => Ok(Some(idString(id) + &self.driver.getFlux().to_string())),
    }
  }

  fn executeSetSetting(&mut self, id: Option<usize>, setting: &Setting, value: u8) -> Result<Option<String>, String> {
    match setting {
      Brightness => { 
        self.driver.setBrightness(value);
        Ok(Some(idString(id) + &"ok".to_string()))
      },
      Roomlight => { 
        self.driver.setRoomlight(value);
        Ok(Some(idString(id) + &"ok".to_string()))
      },
      Flux => { 
        self.driver.setFlux(value);
        Ok(Some(idString(id) + &"ok".to_string()))
      },
    }
  }

  fn executeSetPattern(&mut self, id: Option<usize>, targetPatterns: &Vec<(Target, Pattern)>) -> Result<Option<String>, String> {
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

    Ok(Some(idString(id) + &"ok".to_string()))
  }
}

fn idString(id: Option<usize>) -> String {
  match id {
    None => "".to_owned(),
    Some(i) => "id ".to_owned() + &i.to_string() + " ",
  }
}
