use super::colors::{ Color };
use std::f64::consts;

lalrpop_mod!(pub api);

#[derive(Clone,Debug,PartialEq)]
pub enum Command {
  GetSetting(Option<usize>, Setting),
  SetSetting(Option<usize>, Setting, u8),
  SetPattern(Option<usize>, Vec<(Target, Pattern)>),
}

#[derive(Clone,Debug,PartialEq)]
pub enum Setting {
  Brightness,
  Roomlight,
  Flux,
}

#[derive(Clone,Debug,PartialEq)]
pub enum Target {
  All,
  One(usize),
  Multiple(Vec<usize>),
}

#[derive(Clone,Debug,PartialEq)]
pub enum Pattern {
  Solid(Color),
  Fade(Color, usize, Interpolator)
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
        let t = 8.0 * (stepRatio - 0.5);
        delta as f64 * (1.0 / (1.0 + consts::E.powf(-t)))
      }
    }
  }
}

use Target::*;
use Pattern::*;
use Setting::*;

#[test]
fn testParseGetSetting() {
  let cmd = api::CommandParser::new().parse("get brightness").unwrap();
  assert_eq!(cmd, Command::GetSetting(None, Brightness));

  let cmd = api::CommandParser::new().parse("get roomlight").unwrap();
  assert_eq!(cmd, Command::GetSetting(None, Roomlight));
  
  let cmd = api::CommandParser::new().parse("get flux").unwrap();
  assert_eq!(cmd, Command::GetSetting(None, Flux));

  let cmd = api::CommandParser::new().parse("id 1 get brightness").unwrap();
  assert_eq!(cmd, Command::GetSetting(Some(1), Brightness));

  let cmd = api::CommandParser::new().parse("id 2 get roomlight").unwrap();
  assert_eq!(cmd, Command::GetSetting(Some(2), Roomlight));
  
  let cmd = api::CommandParser::new().parse("id 3 get flux").unwrap();
  assert_eq!(cmd, Command::GetSetting(Some(3), Flux));
}

#[test]
fn testParseSetSetting() {
  let cmd = api::CommandParser::new().parse("set brightness 123").unwrap();
  assert_eq!(cmd, Command::SetSetting(None, Brightness, 123));

  let cmd = api::CommandParser::new().parse("set brightness 0").unwrap();
  assert_eq!(cmd, Command::SetSetting(None, Brightness, 0));

  let cmd = api::CommandParser::new().parse("set roomlight 255").unwrap();
  assert_eq!(cmd, Command::SetSetting(None, Roomlight, 255));

  let cmd = api::CommandParser::new().parse("set flux 2").unwrap();
  assert_eq!(cmd, Command::SetSetting(None, Flux, 2));

  let cmd = api::CommandParser::new().parse("id 1 set brightness 0").unwrap();
  assert_eq!(cmd, Command::SetSetting(Some(1), Brightness, 0));

  let cmd = api::CommandParser::new().parse("id 2 set roomlight 255").unwrap();
  assert_eq!(cmd, Command::SetSetting(Some(2), Roomlight, 255));

  let cmd = api::CommandParser::new().parse("id 3 set flux 2").unwrap();
  assert_eq!(cmd, Command::SetSetting(Some(3), Flux, 2));

  // erroneous syntax
  let res = api::CommandParser::new().parse("set brightness -1");
  assert!(res.is_err());

  let res = api::CommandParser::new().parse("set brightness 256");
  assert!(res.is_err());

  let res = api::CommandParser::new().parse("set brightness 65.5");
  assert!(res.is_err());
}

#[test]
fn testParseSetPattern() {
  let cmd = api::CommandParser::new().parse("set all solid 123 45 67").unwrap();
  assert_eq!(cmd, Command::SetPattern(None, vec![(All, Solid(Color { red: 123, green: 45, blue: 67 }))]));

  let cmd = api::CommandParser::new().parse("id 420 set all solid 123 45 67").unwrap();
  assert_eq!(cmd, Command::SetPattern(Some(420), vec![(All, Solid(Color { red: 123, green: 45, blue: 67 }))]));

  let cmd = api::CommandParser::new().parse("set 1 solid 100 200 255").unwrap();
  assert_eq!(cmd, Command::SetPattern(None, vec![(One(1), Solid(Color { red: 100, green: 200, blue: 255 }))]));
  
  let cmd = api::CommandParser::new().parse("set 1,2 solid 100 200 100").unwrap();
  assert_eq!(cmd, Command::SetPattern(None, vec![(Multiple(vec![1,2]), Solid(Color { red: 100, green: 200, blue: 100 }))]));

  let cmd = api::CommandParser::new().parse("set all solid 123 45 67, 2 solid 4 2 0").unwrap();
  assert_eq!(cmd, Command::SetPattern(None, vec![
    (All, Solid(Color { red: 123, green: 45, blue: 67 })),
    (One(2), Solid(Color { red: 4, green: 2, blue: 0 }))
  ]));

  let cmd = api::CommandParser::new().parse("set all solid 123 45 67, 2 solid 4 2 0, 1,2 solid 133 74 20").unwrap();
  assert_eq!(cmd, Command::SetPattern(None, vec![
    (All, Solid(Color { red: 123, green: 45, blue: 67 })),
    (One(2), Solid(Color { red: 4, green: 2, blue: 0 })),
    (Multiple(vec![1,2]), Solid(Color { red: 133, green: 74, blue: 20 }))
  ]));

  let cmd = api::CommandParser::new().parse("set all solid 123 45 67, 2 fade 4 2 0 420 linear").unwrap();
  assert_eq!(cmd, Command::SetPattern(None, vec![
    (All, Solid(Color { red: 123, green: 45, blue: 67 })),
    (One(2), Fade(Color { red: 4, green: 2, blue: 0 }, 420, Interpolator::Linear))
  ]));
}

#[test]
fn testParsePattern() {
  let p = api::PatternParser::new().parse("solid 200 199 100").unwrap();
  assert_eq!(p, Solid(Color{ red: 200, green: 199, blue: 100 }));

  let p = api::PatternParser::new().parse("fade 255 100 10 3000 linear").unwrap();
  assert_eq!(p, Fade(Color{ red: 255, green: 100, blue: 10 }, 3000, Interpolator::Linear));

  let p = api::PatternParser::new().parse("fade 255 100 10 3000 sigmoid").unwrap();
  assert_eq!(p, Fade(Color{ red: 255, green: 100, blue: 10 }, 3000, Interpolator::Sigmoid));

  // erroneous syntax
  let res = api::PatternParser::new().parse("fade 255 100 10 -1 sigmoid");
  assert!(res.is_err());
}
