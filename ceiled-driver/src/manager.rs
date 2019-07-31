use super::ceiled::{ CeiledDriver };
use super::commands::{ Action, Command, Interpolator, Pattern, Target, TargetSetting, Setting };
use super::colors::Color;
use Target::*;
use TargetSetting::*;
use Setting::*;

use cancellation::{ CancellationTokenSource };
use std::collections::HashMap;

/**
 * DriverManager acts as a generic wrapper around a driver, keeping track of long running operations that may need to be cancelled,
 * and providing an implementation for applying a Command to the driver.
 */
pub struct DriverManager {
  driver: Box<CeiledDriver + Send>,
  lastCommand: Option<Command>,
  toBeCancelled: Option<CancellationTokenSource>,
}

/**
 * Static methods, i.e. DriverManager::new(driver)
 */
impl DriverManager {
  pub fn new(driver: Box<CeiledDriver + Send>) -> Self {
    DriverManager {
      driver,
      lastCommand: None,
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

  pub fn getLastCommand(&self) -> Option<Command> {
    self.lastCommand.clone()
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
    match cmd.action() {
      Action::SET => { self.executeSet(cmd) },
      Action::GET => { self.executeGet(cmd.arg1()) },
    }
  }

  fn executeGet(&self, target: &TargetSetting) -> Result<Option<String>, String> {
    match target {
      Setting(Brightness) => Ok(Some(self.driver.getBrightness().to_string())),
      Setting(Roomlight) => Ok(Some(self.driver.getRoomlight().to_string())),
      Setting(Flux) => Ok(Some(self.driver.getFlux().to_string())),
      _ => match &self.lastCommand {
        None => Ok(Some("none".to_string())),
        Some(cmd) => Ok(Some(cmd.toCmd()))
      }
    }
  }

  fn executeSet(&mut self, cmd: &Command) -> Result<Option<String>, String> {
    match cmd.arg1() {
      Target(_) => self.executeSetPattern(cmd)?,
      Setting(Brightness) => { self.executeSetBrightness(*cmd.number())?; return Ok(Some("ok".to_string())); },
      Setting(Roomlight) => { self.executeSetRoomlight(*cmd.number())?; return Ok(Some("ok".to_string())); },
      Setting(Flux) => { self.executeSetFlux(*cmd.number())?; return Ok(Some("ok".to_string())); },
    }
    self.lastCommand = Some(cmd.clone());
    Ok(Some("ok".to_string()))
  }

  fn executeSetPattern(&mut self, cmd: &Command) -> Result<(), String> {
    match cmd.pattern() {
      Pattern::None => Ok(()),
      Pattern::Solid(targetColors) => self.executeSetSolid(targetColors),
      Pattern::Fade(targetColors, millis, interp) => self.executeSetFade(targetColors, *millis, interp.clone()),
    }
  }

  fn executeSetSolid(&mut self, targetColors: &Vec<(Target, Color)>) -> Result<(), String> {
    let mut colors = HashMap::new();
    for (target, color) in targetColors {
      match target {
        All => for ch in 0..self.driver.channels() { colors.insert(ch, color.clone()); },
        One { channel } => { colors.insert(*channel, color.clone()); },
        Multiple { channels } => { for ch in channels { colors.insert(*ch, color.clone()); }; },
      }
    }
      
    self.driver.setColors(colors)
  }

  fn executeSetFade(&mut self, targetColors: &Vec<(Target, Color)>, millis: u32, interp: Interpolator) -> Result<(), String> {
    let mut colors = HashMap::new();
    for (target, color) in targetColors {
      match target {
        All => for ch in 0..self.driver.channels() { colors.insert(ch, color.clone()); },
        One { channel } => { colors.insert(*channel, color.clone()); },
        Multiple { channels } => { for ch in channels { colors.insert(*ch, color.clone()); }; },
      }
    }
        
    self.cancelCurrent();
    let cts = self.driver.setFades(colors, millis, interp)?;
    self.toBeCancelled = Some(cts);
    Ok(())
  }

  fn executeSetBrightness(&mut self, value: u8) -> Result<(), String> {
    self.driver.setBrightness(value);
    Ok(())
  }

  fn executeSetRoomlight(&mut self, value: u8) -> Result<(), String> {
    self.driver.setRoomlight(value);
    Ok(())
  }

  fn executeSetFlux(&mut self, value: u8) -> Result<(), String> {
    self.driver.setFlux(value);
    Ok(())
  }
}
