#![allow(non_snake_case)]
#[macro_use] extern crate lazy_static;
extern crate cancellation;

mod commands;
mod debug;
mod manager;

use ceiled::{ CeiledDriver };
use commands::{ Command };
use debug::{ DebugDriver };
use manager::DriverManager;

use crossterm::{ Colored, Crossterm };
use ctrlc;
use nix::errno::Errno;
use nix::sys::stat::{ Mode };
use nix::unistd;
use std::fs;
use std::sync::{ Arc, Mutex };
use std::sync::atomic::{ AtomicBool, Ordering };
use std::thread;
use std::thread::sleep;
use std::time::{ Duration };

static PIPE_PATH: &'static str = "ceiled.pipe";

/**
 * Initialize the drivers.
 */
lazy_static! {
  static ref RUNNING: Arc<AtomicBool> = Arc::new(AtomicBool::new(true));
  static ref CTERM: Crossterm = Crossterm::new();
  static ref DEV_DEBUG: Arc<Mutex<DriverManager<DebugDriver>>> = Arc::new(Mutex::new(DriverManager::new(DebugDriver::new(&CTERM, 3))));
}

fn main() -> Result<(), &'static str> {
  println!("{}-> CeiLED driver starting...", Colored::Bg(crossterm::Color::Reset));
  checkPipe().expect("failed to open pipe");

  // make list of enabled drivers.
  let drivers = vec![&DEV_DEBUG];
  for driver in drivers.clone() {
    driver.lock().unwrap().get().lock().unwrap().init();
  }

  // set up main loop with ctrl-c handler.
  let r = RUNNING.clone();
  ctrlc::set_handler(move || {
    r.store(false, Ordering::SeqCst);
    fs::write(PIPE_PATH, "").expect("failed to write EOF to pipe"); 
  }).expect("Error setting Ctrl-C handler");

  println!("{}-> Listening for commands...", Colored::Bg(crossterm::Color::Reset));

  // main loop
  while RUNNING.load(Ordering::SeqCst) {
    // parse incoming commands
    let cmdStr = fs::read_to_string(PIPE_PATH).expect("failed to read from pipe");
    if cmdStr == "" { continue }
    let cmd = Command::parse(&cmdStr);
    if cmd.is_err() { 
      print!("{}invalid command given: {}, command: {}", Colored::Bg(crossterm::Color::Reset), cmd.unwrap_err(), cmdStr);
      continue;
    }

    let command = cmd.unwrap();
    println!("{}Command: {:?}", Colored::Bg(crossterm::Color::Reset), &command);

    // spawn one thread for each driver in order to execute the command
    for driver in drivers.clone() {
      let c = command.clone();
      let d = driver.clone();
      thread::spawn(move || {
        let res = d.lock().unwrap().execute(&c);
        if res.is_err() { 
          println!("{}{}Error applying command: {}", Colored::Bg(crossterm::Color::Reset), Colored::Fg(crossterm::Color::Red), res.unwrap_err());
        }
      });
    }
  }

  // TODO: initialize CeiledPca9685 driver, if that fails launch debug driver
  // TODO: implement setFades method
  // TODO: implement blend, withRoomlight etc methods on Color.
  // TODO: implement CeiledPca9685


  println!("{}", Colored::Bg(crossterm::Color::Reset));
  println!("CeiLED driver stopping.");
  fs::remove_file(PIPE_PATH).expect("cannot remove ceiled.pipe");
  println!("CeiLED driver stopped.");
  Ok(())
}

/**
 * Checks whether the ceiled.pipe named pipe can be created and opens it.
 * If the file already exists, try to delete it and then try to open again.
 */
fn checkPipe() -> Result<(), &'static str> {
  let mut tries = 0;
  while tries < 2 {
    // create named pipe for input
    match unistd::mkfifo(PIPE_PATH, Mode::S_IRWXU) {
      Ok(_)    => { 
        println!("{}-> Opened pipe at {}", Colored::Bg(crossterm::Color::Reset), PIPE_PATH); 
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
  use super::commands::{ Interpolator };
  use super::cancellation::{ CancellationTokenSource };
  
  pub trait CeiledDriver {
    fn channels(&self) -> usize;
    fn init(&mut self) -> Result<(), &'static str>;
    fn off(&mut self) -> Result<(), &'static str>;
    fn setColor(&mut self, channel: usize, color: Color) -> Result<(), &'static str>;
    fn setColors(&mut self, colors: Vec<Color>) -> Result<(), &'static str>;
    fn setFade(&mut self, channel: usize, to: Color, millis: u32, interp: Interpolator) -> Result<CancellationTokenSource, &'static str>;
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