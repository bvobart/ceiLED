use super::colors::{ Color };

use std::f64::consts;

#[derive(Clone,Debug,PartialEq)]
pub enum Action {
  GET,
  SET,
}

#[derive(Clone,Debug,PartialEq)]
pub enum TargetSetting {
  Target(Target),
  Setting(Setting)
}

#[derive(Clone,Debug,PartialEq)]
pub enum Target {
  All,
  One { channel: usize },
  Multiple { channels: Vec<usize> },
}

#[derive(Clone,Debug,PartialEq)]
pub enum Setting {
  Brightness,
  Roomlight,
  Flux,
}

#[derive(Clone,Debug,PartialEq)]
pub enum Pattern {
  None,
  Solid(Vec<(Target, Color)>),
  Fade(Vec<(Target, Color)>, u32, Interpolator)
}

#[derive(Clone,Debug)]
pub struct Command {
  action: Action,
  arg1: TargetSetting,
  pattern: Pattern,
  number: u8
}

#[derive(Clone,Debug,PartialEq)]
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

use TargetSetting::*;
use self::Target::*;
use self::Setting::*;

/**
 * Static functions, parsing mainly.
 */
impl Command {
  pub fn parse(cmd: &str) -> Result<Self, String> {
    let mut iter = cmd.split_whitespace();
    let action = Command::parseAction(iter.next())?;
    let arg1 = Command::parseTargetSetting(iter.next())?;
    
    let mut target = match arg1 {
      Setting(_) => { // if setting, return immediately
        match action {
          Action::GET => { return Ok(Command { action, arg1, pattern: Pattern::None, number: 0 }) },
          Action::SET => { return Ok(Command { action, arg1, pattern: Pattern::None, number: Command::parseByte(iter.next())? }) }
        } 
      },
      Target(t) => {
        match action { // also for get target, return immediately
          Action::GET => { return Ok(Command { action, arg1: Target(t), pattern: Pattern::None, number: 0 }) },
          Action::SET => t // else continue to parse pattern
        }
      }
    };

    let pattern = match iter.next() {
      Some("solid") => {
        let mut colors = vec![];
        loop {
          let color = Command::parseColor(iter.next(), iter.next(), iter.next())?;
          colors.push((target.clone(), color));

          match iter.next() {
            Some(",") => { target = Command::parseTarget(iter.next())?; },
            Some(x) => { return Err("expected comma, but found: ".to_owned() + x); },
            None => break,
          };
        }
        Ok(Pattern::Solid(colors))
      },
      Some("fade") => {
        let mut colors = vec![];
        let millis: u32;
        loop {
          let to = Command::parseColor(iter.next(), iter.next(), iter.next())?;
          colors.push((target.clone(), to));

          match iter.next() {
            Some(",") => { target = Command::parseTarget(iter.next())?; },
            Some(x) => {
              millis = Command::parseDuration(Some(x))?;
              break;
            },
            None => { return Err("no duration specified".to_string()); },
          };
        }
        let interpolator = Command::parseInterpolation(iter.next())?;
        Ok(Pattern::Fade(colors, millis, interpolator))
      },
      Some(p) => Err("unknown pattern type".to_owned() + p),
      None => Err("no pattern specified".to_string())
    }?;

    Ok(Command { action, arg1: Target(target), pattern, number: 0 })
  }

  fn parseAction(cmd: Option<&str>) -> Result<Action, String> {
    match cmd {
      Some("set") => Ok(Action::SET),
      Some("get") => Ok(Action::GET),
      Some(a) => Err("invalid action: ".to_owned() + a),
      None => Err("no action specified".to_string())
    }
  }

  fn parseTargetSetting(cmd: Option<&str>) -> Result<TargetSetting, String> {
    match cmd {
      Some("all") => Ok(Target(All)),
      Some("brightness") => Ok(Setting(Brightness)),
      Some("roomlight") => Ok(Setting(Roomlight)),
      Some("flux") => Ok(Setting(Flux)),
      Some(channelStr) => {
        let mut channels = vec![];
        for chStr in channelStr.split(",") {
          let channel = chStr.parse::<usize>();
          if channel.is_err() { return Err("invalid channel specified: ".to_owned() + chStr) };
          channels.push(channel.unwrap());
        }
        if channels.len() == 0 { return Err("No channel numbers specified".to_string()) };
        if channels.len() == 1 { return Ok(Target(One { channel: channels[0] })) };
        Ok(Target(Multiple { channels }))
      },
      None => Err("no target specified".to_string())
    }
  }

  fn parseTarget(cmd: Option<&str>) -> Result<Target, String> {
    match Command::parseTargetSetting(cmd) {
      Ok(Target(t)) => Ok(t),
      Ok(Setting(s)) => Err(format!("not a target {:?}", s)),
      Err(err) => Err(err)
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
      None => Err("no duration specified".to_string())
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

  pub fn arg1(&self) -> &TargetSetting {
    &self.arg1
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

    let targetStr = self.arg1.toCmd();

    let patternStr = match &self.pattern {
      Pattern::None => "".to_string(),
      Pattern::Solid(colors) => {
        let mut pstr = "".to_string();
        for (i, (target, color)) in colors.iter().enumerate() {
          pstr = match i {
            0 => format!("solid {} {} {}", color.red, color.green, color.blue),
            _ => format!("{}, {} solid {} {} {}", pstr, target.toCmd(), color.red, color.green, color.blue)
          }
        }
        pstr
      },
      Pattern::Fade(colors, millis, interpolator) => { 
        let mut pstr = "".to_string();
        for (i, (target, color)) in colors.iter().enumerate() {
          pstr = match i {
            0 => format!("fade {} {} {}", color.red, color.green, color.blue),
            _ => format!("{}, {} fade {} {} {}", pstr, target.toCmd(), color.red, color.green, color.blue)
          }
        }

        let interpStr = match interpolator {
          Interpolator::Linear => "linear",
          Interpolator::Sigmoid => "sigmoid"
        };
        format!("{} {} {}", pstr, millis, interpStr)
      }
    };

    match &self.arg1 {
      Setting(_) => format!("{} {} {}", actionStr, targetStr, self.number.to_string()),
      _ => format!("{} {} {}", actionStr, targetStr, patternStr)
    }
  }
}

impl Target {
  fn toCmd(&self) -> String {
    match &self {
      All => "all".to_string(),
      One { channel } => channel.to_string(),
      Multiple { channels } => {
        let chStrs: Vec<String> = channels.iter().map(|ch| ch.to_string()).collect();
        chStrs.join(",")
      }
    }
  }
}

impl Setting {
  fn toCmd(&self) -> String {
    match &self {
      Brightness => "brightness".to_string(),
      Roomlight => "roomlight".to_string(),
      Flux => "flux".to_string(),
    }
  }
}

impl TargetSetting {
  fn toCmd(&self) -> String {
    match &self {
      Target(t) => t.toCmd(),
      Setting(s) => s.toCmd(),
    }
  }
}

#[cfg(test)]
mod testParseCommands {
  use super::*;

  #[test]
  fn testParseGetBrightness() {
    let cmd = Command::parse("get brightness").unwrap();
    assert_eq!(*cmd.action(), Action::GET);
    assert_eq!(*cmd.pattern(), Pattern::None);
    assert_eq!(*cmd.arg1(), Setting(Brightness));
  }

  #[test]
  fn testParseGetRoomlight() {
    let cmd = Command::parse("get roomlight").unwrap();
    assert_eq!(*cmd.action(), Action::GET);
    assert_eq!(*cmd.pattern(), Pattern::None);
    assert_eq!(*cmd.arg1(), Setting(Roomlight));
  }

  #[test]
  fn testParseGetFlux() {
    let cmd = Command::parse("get flux").unwrap();
    assert_eq!(*cmd.action(), Action::GET);
    assert_eq!(*cmd.pattern(), Pattern::None);
    assert_eq!(*cmd.arg1(), Setting(Flux));
  }

  #[test]
  fn testParseSetBrightness() {
    let cmd = Command::parse("set brightness 65").unwrap();
    assert_eq!(*cmd.action(), Action::SET);
    assert_eq!(*cmd.pattern(), Pattern::None);
    assert_eq!(*cmd.arg1(), Setting(Brightness));
    assert_eq!(*cmd.number(), 65);
  }

  #[test]
  fn testParseSetRoomlight() {
    let cmd = Command::parse("set roomlight 65").unwrap();
    assert_eq!(*cmd.action(), Action::SET);
    assert_eq!(*cmd.pattern(), Pattern::None);
    assert_eq!(*cmd.arg1(), Setting(Roomlight));
  }

  #[test]
  fn testParseSetFlux() {
    let cmd = Command::parse("set flux 65").unwrap();
    assert_eq!(*cmd.action(), Action::SET);
    assert_eq!(*cmd.pattern(), Pattern::None);
    assert_eq!(*cmd.arg1(), Setting(Flux));
    assert_eq!(*cmd.number(), 65);
  }

  #[test]
  fn testParseSetAllSolid() {
    let cmd = Command::parse("set all solid 255 0 65").unwrap();
    assert_eq!(*cmd.action(), Action::SET);
    assert_eq!(*cmd.pattern(), Pattern::Solid(vec![(All, Color { red: 255, green: 0, blue: 65 })]));
  }

  #[test]
  fn testParseSetOneSolid() {
    let cmd = Command::parse("set 1 solid 255 0 65").unwrap();
    assert_eq!(*cmd.action(), Action::SET);
    assert_eq!(*cmd.pattern(), Pattern::Solid(vec![(One { channel: 1 }, Color { red: 255, green: 0, blue: 65 })]));
  }

  #[test]
  fn testParseSetMultipleSameSolid() {
    let cmd = Command::parse("set 1,2 solid 255 0 65").unwrap();
    assert_eq!(*cmd.action(), Action::SET);
    assert_eq!(*cmd.pattern(), Pattern::Solid(vec![(Multiple { channels: vec![1,2] }, Color { red: 255, green: 0, blue: 65 })]));
  }

  #[test]
  fn testParseSetMultipleDifferentSolid() {
    let cmd = Command::parse("set 0 solid 255 0 65 , 1 20 40 60").unwrap();
    assert_eq!(*cmd.action(), Action::SET);
    assert_eq!(*cmd.pattern(), Pattern::Solid(vec![
      (One { channel: 0 }, Color { red: 255, green: 0, blue: 65 }),
      (One { channel: 1 }, Color { red: 20, green: 40, blue: 60 }),
    ]));
  }

  #[test]
  fn testParseSetAllFade() {
    let cmd = Command::parse("set all fade 255 0 65 1965").unwrap();
    assert_eq!(*cmd.action(), Action::SET);
    assert_eq!(*cmd.pattern(), Pattern::Fade(vec![(All, Color { red: 255, green: 0, blue: 65 })], 1965, Interpolator::Linear));
  }

  #[test]
  fn testParseSetOneFade() {
    let cmd = Command::parse("set 1 fade 255 0 65 6565 sigmoid").unwrap();
    assert_eq!(*cmd.action(), Action::SET);
    assert_eq!(*cmd.pattern(), Pattern::Fade(vec![(One { channel: 1 }, Color { red: 255, green: 0, blue: 65 })], 6565, Interpolator::Sigmoid));
  }

  #[test]
  fn testParseSetMultipleSameFade() {
    let cmd = Command::parse("set 1,2 fade 255 0 65 1000").unwrap();
    assert_eq!(*cmd.action(), Action::SET);
    assert_eq!(*cmd.pattern(), Pattern::Fade(vec![(Multiple { channels: vec![1,2] }, Color { red: 255, green: 0, blue: 65 })], 1000, Interpolator::Linear));
  }

  #[test]
  fn testParseSetMultipleDifferentFade() {
    let cmd = Command::parse("set 0 fade 255 0 65 , 1 20 40 60 1000 sigmoid").unwrap();
    assert_eq!(*cmd.action(), Action::SET);
    assert_eq!(*cmd.pattern(), Pattern::Fade(vec![
      (One { channel: 0 }, Color { red: 255, green: 0, blue: 65 }),
      (One { channel: 1 }, Color { red: 20, green: 40, blue: 60 }),
    ], 1000, Interpolator::Sigmoid));
  }
}