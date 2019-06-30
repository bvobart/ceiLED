use super::ceiled::{ CeiledDriver, Dimmable, RoomlightSupport, Fluxable };
use super::commands::{ Action, Command, Pattern, Target };
use cancellation::{ CancellationTokenSource };
use std::collections::HashMap;

/**
 * DriverManager acts as a generic wrapper around a driver, keeping track of long running operations that may need to be cancelled,
 * and providing an implementation for applying a Command to the driver.
 */
pub struct DriverManager<Driver: CeiledDriver + 'static + Send> {
  driver: Driver,
  lastCommand: Option<Command>,
  toBeCancelled: Option<CancellationTokenSource>,
}

/**
 * Static methods, i.e. DriverManager::new(driver)
 */
impl <Driver: CeiledDriver + 'static + Send> DriverManager<Driver> {
  pub fn new(driver: Driver) -> Self {
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
impl <Driver: CeiledDriver + 'static + Send> DriverManager<Driver> {
  pub fn get(&mut self) -> &mut Driver {
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
impl <Driver: CeiledDriver + 'static + Send + Dimmable + RoomlightSupport + Fluxable> DriverManager<Driver> {
  pub fn execute(&mut self, cmd: &Command) -> Result<Option<String>, &'static str> {
    match cmd.action() {
      Action::SET => { self.executeSet(cmd) },
      Action::GET => { self.executeGet(cmd.target()) },
      _ => Err("that action is not implemented")
    }
  }

  fn executeGet(&self, target: &Target) -> Result<Option<String>, &'static str> {
    match target {
      Target::Brightness => Ok(Some(self.driver.getBrightness().to_string())),
      Target::Roomlight => Ok(Some(self.driver.getRoomlight().to_string())),
      Target::Flux => Ok(Some(self.driver.getFlux().to_string())),
      _ => match &self.lastCommand {
        None => Ok(Some("none".to_string())),
        Some(cmd) => Ok(Some(cmd.toCmd()))
      }
    }
  }

  fn executeSet(&mut self, cmd: &Command) -> Result<Option<String>, &'static str> {
    match cmd.target() {
      Target::All => self.executeSetAll(cmd)?,
      Target::One { channel } => self.executeSetOne(cmd, *channel)?,
      Target::Multiple { channels } => self.executeSetMultiple(cmd, channels.clone())?,
      Target::Brightness => { self.executeSetBrightness(*cmd.number())?; return Ok(Some("ok".to_string())); },
      Target::Roomlight => { self.executeSetRoomlight(*cmd.number())?; return Ok(Some("ok".to_string())); },
      Target::Flux => { self.executeSetFlux(*cmd.number())?; return Ok(Some("ok".to_string())); },
    }
    self.lastCommand = Some(cmd.clone());
    Ok(Some("ok".to_string()))
  }

  fn executeSetAll(&mut self, cmd: &Command) -> Result<(), &'static str> {
    match cmd.pattern() {
      Pattern::None => Ok(()),
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
      Pattern::None => Ok(()),
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
      Pattern::None => Ok(()),
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

  fn executeSetBrightness(&mut self, value: u8) -> Result<(), &'static str> {
    self.driver.setBrightness(value);
    Ok(())
  }

  fn executeSetRoomlight(&mut self, value: u8) -> Result<(), &'static str> {
    self.driver.setRoomlight(value);
    Ok(())
  }

  fn executeSetFlux(&mut self, value: u8) -> Result<(), &'static str> {
    self.driver.setFlux(value);
    Ok(())
  }
}
