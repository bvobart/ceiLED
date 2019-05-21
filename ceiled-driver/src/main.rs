#![allow(non_snake_case)]

mod debug;

use debug::{ DebugDriver };
use ceiled::{ CeiledDriver };

use crossterm::{ Colored };
use ctrlc;
use nix::sys::stat::{ Mode };
use nix::unistd;
use rand::Rng;
use std::fs;
use std::sync::Arc;
use std::sync::atomic::{ AtomicBool, Ordering };
use std::thread::sleep;
use std::time::{ Duration };

static PIPE_PATH: &'static str = "ceiled.pipe";

fn main() -> Result<(), &'static str> {
  println!("CeiLED driver starting...");

  // create named pipe for input
  match unistd::mkfifo(PIPE_PATH, Mode::S_IRWXU) {
    Ok(_)    => println!("Opened pipe at {}", PIPE_PATH),
    Err(err) => { println!("Error opening pipe: {}", err); return Err("cannot open pipe") }
  }
  
  println!("");
  let mut dbgDriver = DebugDriver::new(3);

  let running = Arc::new(AtomicBool::new(true));
  let r = running.clone();
  ctrlc::set_handler(move || { r.store(false, Ordering::SeqCst); }).expect("Error setting Ctrl-C handler");
  
  let mut rng = rand::thread_rng();
  let colors = [Colors::BLACK, Colors::WHITE, Colors::RED, Colors::GREEN, Colors::BLUE];
  while running.load(Ordering::SeqCst) {
    let c1 = colors[rng.gen_range(0, 5)].clone();
    let c2 = colors[rng.gen_range(0, 5)].clone();
    let c3 = colors[rng.gen_range(0, 5)].clone(); 
    
    dbgDriver.setColors(vec![c1, c2, c3]);

    sleep(Duration::from_millis(500));
  }

  // TODO: listen to pipe for new commands
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
  
  #[derive(Clone)]
  pub struct Color { pub red: u8, pub green: u8, pub blue: u8 }
  impl Color {
    pub fn new(red: u8, green: u8, blue: u8) -> Self {
      Color { red, green, blue }
    }
  }
}