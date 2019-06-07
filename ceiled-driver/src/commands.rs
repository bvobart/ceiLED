use super::Colors;

use std::f64::consts;

#[derive(Clone,Debug)]
pub enum Action {
  GET,
  SET,
}

#[derive(Clone,Debug)]
pub enum Target {
  All,
  One { channel: usize },
}

#[derive(Clone,Debug)]
pub enum Pattern {
  Solid { color: Colors::Color },
  Fade { to: Colors::Color, millis: u32, interpolator: Interpolator }
}

#[derive(Clone,Debug)]
pub struct Command { 
  action: Action,
  target: Target,
  pattern: Pattern,
}

#[derive(Clone,Debug)]
pub enum Interpolator {
  Linear,
  Sigmoid
}

impl Interpolator {
  pub fn interpolate(&self, delta: f64, currentStep: u32, totalSteps: u32) -> f64 {
    match self {
      Interpolator::Linear => (delta * currentStep as f64) / totalSteps as f64,
      Interpolator::Sigmoid => {
        let stepRatio = currentStep as f64 / totalSteps as f64;
        let t = 8.0 * stepRatio - 0.5;
        delta as f64 * (1.0 / (1.0 + consts::E.powf(-t)))
      }
    }
  }
}

/**
 * Static functions, parsing mainly.
 */
impl Command {
  pub fn parse(cmd: &str) -> Result<Self, &'static str> {
    let mut iter = cmd.split_whitespace();
    let action = Command::parseAction(iter.next())?;
    let target = Command::parseTarget(iter.next())?;
    let pattern = match iter.next() {
      Some("solid") => {
        let color = Command::parseColor(iter.next(), iter.next(), iter.next())?;
        Ok(Pattern::Solid { color })
      },
      Some("fade") => {
        let to = Command::parseColor(iter.next(), iter.next(), iter.next())?;
        let millis = Command::parseDuration(iter.next())?;
        let interpolator = Command::parseInterpolation(iter.next())?;
        Ok(Pattern::Fade { to, millis, interpolator })
      },
      Some(_) => Err("unknown pattern type"),
      None => Err("no pattern specified")
    }?;

    Ok(Command { action, target, pattern })
  }

  fn parseAction(cmd: Option<&str>) -> Result<Action, &'static str> {
    match cmd {
      Some("set") => Ok(Action::SET),
      Some("get") => Ok(Action::GET),
      Some(_) => Err("invalid action"),
      None => Err("no action specified")
    }
  }

  fn parseTarget(cmd: Option<&str>) -> Result<Target, &'static str> {
    match cmd {
      Some("all") => Ok(Target::All),
      Some(num) => {
        // TODO: allow support for comma separated values "1,2,3"
        let channel = num.parse::<usize>();
        if channel.is_err() { return Err("invalid channel specified") };
        Ok(Target::One { channel: channel.unwrap() })
      },
      None => Err("no target specified")
    }
  }

  fn parseColor(r: Option<&str>, g: Option<&str>, b: Option<&str>) -> Result<Colors::Color, &'static str> {
    let red = Command::parseByte(r)?;
    let green = Command::parseByte(g)?;
    let blue = Command::parseByte(b)?;
    Ok(Colors::Color { red, green, blue })
  }

  fn parseByte(cmd: Option<&str>) -> Result<u8, &'static str> {
    match cmd {
      Some(num) => {
        let b = num.parse::<u8>();
        if b.is_err() { return Err("value is not a number") }
        Ok(b.unwrap())
      }
      None => Err("no value specified")
    }
  }

  fn parseDuration(cmd: Option<&str>) -> Result<u32, &'static str> {
    match cmd {
      Some(num) => {
        let b = num.parse::<u32>();
        if b.is_err() { return Err("value is not a number") }
        Ok(b.unwrap())
      }
      None => Err("no value specified")
    }
  }

  fn parseInterpolation(cmd: Option<&str>) -> Result<Interpolator, &'static str> {
    match cmd {
      Some("linear") => Ok(Interpolator::Linear),
      Some("sigmoid") => Ok(Interpolator::Sigmoid),
      Some(_) => Err("invalid interpolation type"),
      None => Ok(Interpolator::Linear)
    }
  }
}

/**
 * Instance methods. For applying the command to a driver.
 */
impl Command {
  pub fn action(&self) -> &Action {
    &self.action
  }

  pub fn target(&self) -> &Target {
    &self.target
  }

  pub fn pattern(&self) -> &Pattern {
    &self.pattern
  }
}