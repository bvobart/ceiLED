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
  Multiple { channels: Vec<usize> },
  Brightness,
  Roomlight,
  Flux,
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
  number: u8
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

// TODO: create commands to set brightness, roomlight, flux etc.

/**
 * Static functions, parsing mainly.
 */
impl Command {
  pub fn parse(cmd: &str) -> Result<Self, String> {
    let mut iter = cmd.split_whitespace();
    let action = Command::parseAction(iter.next())?;
    let target = Command::parseTarget(iter.next())?;
    
    match target {
      Target::Brightness | Target::Roomlight | Target::Flux => {
        match action {
          Action::GET => { return Ok(Command { action, target, pattern: Pattern::None, number: 0 }) },
          Action::SET => { return Ok(Command { action, target, pattern: Pattern::None, number: Command::parseByte(iter.next())? }) }
        } 
      },
      _ => {}
    }

    match action {
      Action::GET => { return Ok(Command { action, target, pattern: Pattern::None, number: 0 })},
      _ => {}
    }

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
      Some(p) => Err("unknown pattern type".to_owned() + p),
      None => Err("no pattern specified".to_string())
    }?;

    Ok(Command { action, target, pattern, number: 0 })
  }

  fn parseAction(cmd: Option<&str>) -> Result<Action, String> {
    match cmd {
      Some("set") => Ok(Action::SET),
      Some("get") => Ok(Action::GET),
      Some(a) => Err("invalid action: ".to_owned() + a),
      None => Err("no action specified".to_string())
    }
  }

  fn parseTarget(cmd: Option<&str>) -> Result<Target, String> {
    match cmd {
      Some("all") => Ok(Target::All),
      Some("brightness") => Ok(Target::Brightness),
      Some("roomlight") => Ok(Target::Roomlight),
      Some("flux") => Ok(Target::Flux),
      Some(channelStr) => {
        let mut channels = vec![];
        for chStr in channelStr.split(",") {
          let channel = chStr.parse::<usize>();
          if channel.is_err() { return Err("invalid channel specified: ".to_owned() + chStr) };
          channels.push(channel.unwrap());
        }
        if channels.len() == 0 { return Err("No channel numbers specified".to_string()) };
        if channels.len() == 1 { return Ok(Target::One { channel: channels[0] }) };
        Ok(Target::Multiple { channels })
      },
      None => Err("no target specified".to_string())
    }
  }

  fn parseColor(r: Option<&str>, g: Option<&str>, b: Option<&str>) -> Result<Color, String> {
    let red = Command::parseByte(r)?;
    let green = Command::parseByte(g)?;
    let blue = Command::parseByte(b)?;
    Ok(Color { red, green, blue })
  }

  fn parseByte(cmd: Option<&str>) -> Result<u8, String> {
    match cmd {
      Some(num) => {
        let b = num.parse::<u8>();
        if b.is_err() { return Err("value is not a number: ".to_owned() + num) }
        Ok(b.unwrap())
      }
      None => Err("no value specified".to_string())
    }
  }

  fn parseDuration(cmd: Option<&str>) -> Result<u32, String> {
    match cmd {
      Some(num) => {
        let b = num.parse::<u32>();
        if b.is_err() { return Err("value is not a number: ".to_owned() + num) }
        Ok(b.unwrap())
      }
      None => Err("no value specified".to_string())
    }
  }

  fn parseInterpolation(cmd: Option<&str>) -> Result<Interpolator, String> {
    match cmd {
      Some("linear") => Ok(Interpolator::Linear),
      Some("sigmoid") => Ok(Interpolator::Sigmoid),
      Some(_) => Err("invalid interpolation type".to_string()),
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

  pub fn number(&self) -> &u8 {
    &self.number
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
      },
      Target::Brightness => "brightness".to_string(),
      Target::Roomlight => "roomlight".to_string(),
      Target::Flux => "flux".to_string(),
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

    match &self.target {
      Target::Brightness | Target::Roomlight | Target::Flux => format!("{} {} {}", actionStr, targetStr, self.number.to_string()),
      _ => format!("{} {} {}", actionStr, targetStr, patternStr)
    }
  }
}