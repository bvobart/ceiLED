use super::ceiled;
use super::commands::{ Action, Command, Pattern, Target };
use cancellation::{ CancellationTokenSource };

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
      Target::One { channel } => self.executeSetOne(cmd, *channel)
    }
  }

  fn executeSetAll(&mut self, cmd: &Command) -> Result<(), &'static str> {
    match cmd.pattern() {
      Pattern::Solid { color } => {
        let mut colors = Vec::new();
        for _ in 0..self.driver.channels() { colors.push(color.clone()) }
        self.driver.setColors(colors).expect("failed to set colors");
        Ok(())
      },
      Pattern::Fade { to, millis, interpolator } => {
        let mut colors = Vec::new();
        for _ in 0..self.driver.channels() { colors.push(to) }
        
        self.cancelCurrent();

        let to2 = to.clone();
        let millis2 = *millis;
        let interp2 = interpolator.clone();
          // TODO: fade is not properly implemented yet, so fade on all channels is not yet possible
        self.toBeCancelled = Some(self.driver.setFade(0, to2, millis2, interp2).expect("failed to set fades"));

        Ok(())
      }
    }
  }

  fn executeSetOne(&mut self, cmd: &Command, channel: usize) -> Result<(), &'static str> {
    match cmd.pattern() {
      Pattern::Solid { color } => {
        self.driver.setColor(channel, color.clone()).expect("failed to set color");
        Ok(())
      },
      Pattern::Fade { to, millis, interpolator } => {
        self.cancelCurrent();

        let to2 = to.clone();
        let millis2 = *millis;
        let interp2 = interpolator.clone();
        self.toBeCancelled = Some(self.driver.setFade(0, to2, millis2, interp2).expect("failed to set fades"));

        Ok(())
      }
    }
  }
}