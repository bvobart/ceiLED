use super::ceiled;
use super::commands::{ Action, Command, Pattern, Target };
use cancellation::{ CancellationTokenSource };
use std::collections::HashMap;

/**
 * DriverManager acts as a generic wrapper around a driver, keeping track of long running operations that may need to be cancelled,
 * and providing an implementation for applying a Command to the driver.
 */
pub struct DriverManager<Driver: ceiled::CeiledDriver + 'static + Send> {
  driver: Driver,
  toBeCancelled: Option<CancellationTokenSource>,
}

impl <Driver: ceiled::CeiledDriver + 'static + Send> DriverManager<Driver> {
  pub fn new(driver: Driver) -> Self {
    DriverManager { 
      driver, 
      toBeCancelled: None
    }
  }

  pub fn get(&mut self) -> &mut Driver {
    &mut self.driver
  }
}

impl <Driver: ceiled::CeiledDriver + 'static + Send> DriverManager<Driver> {
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

impl <Driver: ceiled::CeiledDriver + 'static + Send> DriverManager<Driver> {
  pub fn execute(&mut self, cmd: &Command) -> Result<(), &'static str> {
    match cmd.action() {
      Action::SET => self.executeSet(cmd),
      _ => Err("that action is not implemented")
    }
  }

  fn executeSet(&mut self, cmd: &Command) -> Result<(), &'static str> {
    match cmd.target() {
      Target::All => self.executeSetAll(cmd),
      Target::One { channel } => self.executeSetOne(cmd, *channel),
      Target::Multiple { channels } => self.executeSetMultiple(cmd, channels.clone())
    }
  }

  fn executeSetAll(&mut self, cmd: &Command) -> Result<(), &'static str> {
    match cmd.pattern() {
      Pattern::Solid(color) => {
        let mut colors = HashMap::new();
        for ch in 0..self.driver.channels() { colors.insert(ch, color.clone()); }
        self.driver.setColors(colors)
      },
      Pattern::Fade(fp, millis) => {
        let mut fadeMap = HashMap::new();
        for i in 0..self.driver.channels() { fadeMap.insert(i, fp.clone()); }

        self.cancelCurrent();
        match self.driver.setFades(fadeMap, *millis) {
          Ok(cts) => self.toBeCancelled = Some(cts),
          Err(err) => return Err(err)
        }
        Ok(())
      }
    }
  }

  fn executeSetMultiple(&mut self, cmd: &Command, channels: Vec<usize>) -> Result<(), &'static str> {
    match cmd.pattern() {
      Pattern::Solid(color) => {
        for channel in channels {
          match self.driver.setColor(channel, color.clone()) {
            Ok(_) => {},
            Err(err) => return Err(err)
          }
        }
        Ok(())
      },
      Pattern::Fade(fp, millis) => {
        let fadeMap = channels.iter().map(|ch| { (*ch, fp.clone()) }).collect();
        self.cancelCurrent();
        match self.driver.setFades(fadeMap, *millis) {
          Ok(cts) => self.toBeCancelled = Some(cts),
          Err(err) => return Err(err)
        }
        Ok(())
      }
    }
  }

  fn executeSetOne(&mut self, cmd: &Command, channel: usize) -> Result<(), &'static str> {
    match cmd.pattern() {
      Pattern::Solid(color) => {
        self.driver.setColor(channel, color.clone())
      },
      Pattern::Fade(fp, millis) => {
        self.cancelCurrent();
        match self.driver.setFade(0, fp.clone(), *millis) {
          Ok(cts) => self.toBeCancelled = Some(cts),
          Err(err) => return Err(err)
        }
        Ok(())
      }
    }
  }
}