use super::colors::{ Color };

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
  Multiple { channels: Vec<usize> }
}

#[derive(Clone,Debug)]
pub enum Pattern {
  None,
  Solid(Color),
  Fade(FadePattern, u32)
}

#[derive(Clone,Debug)]
pub struct FadePattern { 
  pub to: Color,
  pub interpolator: Interpolator 
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
    match action {
      Action::GET => { return Ok(Command { action, target: Target::All, pattern: Pattern::None }) },
      Action::SET => {}
    }

    let target = Command::parseTarget(iter.next())?;
    let pattern = match iter.next() {
      Some("solid") => {
        let color = Command::parseColor(iter.next(), iter.next(), iter.next())?;
        Ok(Pattern::Solid(color))
      },
      Some("fade") => {
        let to = Command::parseColor(iter.next(), iter.next(), iter.next())?;
        let millis = Command::parseDuration(iter.next())?;
        let interpolator = Command::parseInterpolation(iter.next())?;
        Ok(Pattern::Fade(FadePattern { to, interpolator }, millis))
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
      Some(channelStr) => {
        let mut channels = vec![];
        for chStr in channelStr.split(",") {
          let channel = chStr.parse::<usize>();
          if channel.is_err() { return Err("invalid channel specified") };
          channels.push(channel.unwrap());
        }
        if channels.len() == 0 { return Err("No channel numbers specified") };
        if channels.len() == 1 { return Ok(Target::One { channel: channels[0] }) };
        Ok(Target::Multiple { channels })
      },
      None => Err("no target specified")
    }
  }

  fn parseColor(r: Option<&str>, g: Option<&str>, b: Option<&str>) -> Result<Color, &'static str> {
    let red = Command::parseByte(r)?;
    let green = Command::parseByte(g)?;
    let blue = Command::parseByte(b)?;
    Ok(Color { red, green, blue })
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
 * Instance methods.
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

  /**
   * Transforms this command into the shell command in the way it is to be received through the socket.
   */
  pub fn toCmd(&self) -> String {
    let actionStr = match self.action {
      Action::SET => "set",
      Action::GET => "get"
    };

    let targetStr = match &self.target {
      Target::All => "all".to_string(),
      Target::One { channel } => channel.to_string(),
      Target::Multiple { channels } => {
        let chStrs: Vec<String> = channels.iter().map(|ch| ch.to_string()).collect();
        chStrs.join(",")
      }
    };

    let patternStr = match &self.pattern {
      Pattern::None => "".to_string(),
      Pattern::Solid(color) => format!("solid {} {} {}", color.red, color.green, color.blue),
      Pattern::Fade(fp, millis) => { 
        let interpStr = match fp.interpolator {
          Interpolator::Linear => "linear",
          Interpolator::Sigmoid => "sigmoid"
        };
        format!("fade {} {} {} {} {}", fp.to.red, fp.to.green, fp.to.blue, millis, interpStr)
      }
    };

    format!("{} {} {}", actionStr, targetStr, patternStr)
  }
}