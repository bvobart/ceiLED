#![allow(non_snake_case)]

mod commands;
mod debug;

use ceiled::{ CeiledDriver };
use commands::{ Command };
use debug::{ DebugDriver };

use crossterm::{ Colored };
use ctrlc;
use nix::errno::Errno;
use nix::sys::stat::{ Mode };
use nix::unistd;
use std::fs;
use std::sync::Arc;
use std::sync::atomic::{ AtomicBool, Ordering };
use std::thread::sleep;
use std::time::{ Duration };

static PIPE_PATH: &'static str = "ceiled.pipe";

fn main() -> Result<(), &'static str> {
  println!("CeiLED driver starting...");
  checkPipe().expect("failed to open pipe");

  let running = Arc::new(AtomicBool::new(true));
  let r = running.clone();
  ctrlc::set_handler(move || {
    r.store(false, Ordering::SeqCst);
    fs::write(PIPE_PATH, "").expect("failed to write EOF to pipe"); 
  }).expect("Error setting Ctrl-C handler");
  
  println!("Listening for commands...");
  println!("");
  let mut dbgDriver = DebugDriver::new(3);

  while running.load(Ordering::SeqCst) {
    let command = fs::read_to_string(PIPE_PATH).expect("failed to read from pipe");
    if command == "" { continue }
    print!("Command: {}", command);

    let cmd = Command::parse(&command);
    if cmd.is_err() { 
      print!("invalid command given: {}, command: {}", cmd.unwrap_err(), command);
      continue;
    }

    println!("parsed: {:?}", cmd.unwrap());

    // dbgDriver.setColors(vec![]);

    sleep(Duration::from_millis(500));
  }

  // TODO: initialize CeiledPca9685 driver, if that fails launch debug driver
  // TODO: implement setFade method
  // TODO: implement blend, withRoomlight etc methods on Color.
  // TODO: implement CeiledPca9685
  // TODO: make sure that driver is set to black initially


  println!("{}", Colored::Bg(crossterm::Color::Reset));
  println!("CeiLED driver stopping.");
  fs::remove_file(PIPE_PATH).expect("cannot remove ceiled.pipe");
  println!("CeiLED driver stopped.");
  Ok(())
}

fn checkPipe() -> Result<(), &'static str> {
  let mut tries = 0;
  while tries < 2 {
    // create named pipe for input
    match unistd::mkfifo(PIPE_PATH, Mode::S_IRWXU) {
      Ok(_)    => { 
        println!("Opened pipe at {}", PIPE_PATH); 
        return Ok(()); 
      },

      Err(err) => match err.as_errno() {
        Some(Errno::EEXIST) => { // pipe already exists, try removing pipe and try again.
          tries = tries + 1;
          fs::remove_file(PIPE_PATH).expect("failed to remove pipe");
          sleep(Duration::from_millis(5));
          continue;
        },
        _ => { // default case
          println!("Error opening pipe: {}", err);
        } 
      }
    }
  }
  Err("cannot open pipe")
}

pub mod ceiled {
  use super::Colors::{ Color };
  
  pub trait CeiledDriver {
    fn setColor(&mut self, channel: usize, color: Color);
    fn setColors(&mut self, colors: Vec<Color>);
    fn setFade(&mut self, channel: usize, to: Color, millis: u32);
    // fn setFades(&self, )
  }
}

pub mod Colors {
  pub const BLACK: Color = Color { red: 0, green: 0, blue: 0 };
  pub const WHITE: Color = Color { red: 255, green: 255, blue: 255 };
  pub const RED: Color = Color { red: 255, green: 0, blue: 0 };
  pub const GREEN: Color = Color { red: 0, green: 255, blue: 0 };
  pub const BLUE: Color = Color { red: 0, green: 0, blue: 255 };
  
  #[derive(Clone, Debug)]
  pub struct Color { pub red: u8, pub green: u8, pub blue: u8 }
  impl Color {
    pub fn new(red: u8, green: u8, blue: u8) -> Self {
      Color { red, green, blue }
    }
  }
}