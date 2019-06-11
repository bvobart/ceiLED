#![allow(non_snake_case)]
#[macro_use] extern crate lazy_static;
#[macro_use] extern crate crossbeam_channel;
extern crate cancellation;
extern crate crossterm;
extern crate ctrlc;

mod ceiled;
mod colors;
mod commands;
mod debug;
mod manager;

use ceiled::{ CeiledDriver };
use commands::{ Command };
use debug::{ DebugDriver };
use manager::DriverManager;

use crossterm::{ Colored, Crossterm };
use crossbeam_channel::{ bounded };

use std::fs;
use std::io::prelude::*;
use std::io::{ ErrorKind, BufRead, BufReader };
use std::os::unix::net::{ UnixListener };
use std::sync::{ Arc, Mutex };
use std::thread;
use std::thread::sleep;
use std::time::{ Duration };

static SOCKET_PATH: &'static str = "ceiled.sock";

/**
 * Initialize the drivers.
 */
lazy_static! {
  static ref CTERM: Crossterm = Crossterm::new();
  static ref DEV_DEBUG: Arc<Mutex<DriverManager<DebugDriver>>> = Arc::new(Mutex::new(DriverManager::new(DebugDriver::new(&CTERM, 3))));
}

fn main() -> Result<(), &'static str> {
  println!("{}-> CeiLED driver starting...", Colored::Bg(crossterm::Color::Reset));

  // make list of enabled drivers.
  let drivers = vec![&DEV_DEBUG];
  for driver in drivers.clone() {
    driver.lock().unwrap().get().init().expect("driver failed to perform initialisation");
  }

  // set up ctrl-c handler.
  let (notifyExit, exit) = bounded(1);
  ctrlc::set_handler(move || { notifyExit.send(()).unwrap(); }).expect("failed to set ctrl-c handler");

  // set up ceiled.sock listener
  let sockListener = initSocketListener(SOCKET_PATH)?;
  let (notifyStream, streams) = bounded(65);
  thread::spawn(move || {
    for s in sockListener.incoming() {
      match s {
        Ok(stream) => { let _ = notifyStream.send(stream); },
        Err(err) => println!("{}", err)
      }
    }
  });

  println!("{}-> Listening for commands...", Colored::Bg(crossterm::Color::Reset));

  // main loop
  loop {
    select! {
      // on receiving new stream, spawn new thread to handle the stream
      recv(streams) -> stream => {
        println!("-> New connection opened");
        let drivers = drivers.clone();
        thread::spawn(move || {
          let mut stream = &stream.unwrap();
          let reader = BufReader::new(stream);
          // on receiving new command from the socket
          for l in reader.lines() {
            // parse the command
            let line = l.unwrap();
            let cmd = Command::parse(&line);
            if cmd.is_err() { 
              println!("{}invalid command given: {}, command: {}", Colored::Bg(crossterm::Color::Reset), cmd.unwrap_err(), line);
              let _ = stream.write_all(b"error: invalid command");
              continue;
            }

            let command = cmd.unwrap();
            println!("{}Command: {:?}", Colored::Bg(crossterm::Color::Reset), &command);

            // spawn a thread for each driver in order to execute the command
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
        });
      },
      // on ctrl-c, exit.
      recv(exit) -> _ => break
    }
  }

  // TODO: initialize CeiledPca9685 driver, if that fails launch debug driver
  // TODO: implement blend, withRoomlight etc methods on Color.
  // TODO: implement CeiledPca9685


  println!("{}", Colored::Bg(crossterm::Color::Reset));
  println!("CeiLED driver stopping.");
  fs::remove_file(SOCKET_PATH).expect("cannot remove ceiled.sock");
  println!("CeiLED driver stopped.");
  Ok(())
}

/**
 * Initialises the connection to the Unix domain socket used to listen for commands.
 * If ceiled.sock already exists in this folder, it will try to delete it and then retry to initialise.
 */
fn initSocketListener(address: &str) -> Result<UnixListener, &'static str> {
  match UnixListener::bind(address) {
    Ok(l) => Ok(l),
    Err(err) => { 
      if err.kind() == ErrorKind::AddrInUse {
        fs::remove_file(SOCKET_PATH).expect("failed to remove socket");
        sleep(Duration::from_millis(5));
        match UnixListener::bind(address) {
          Ok(l) => return Ok(l),
          Err(err) => println!("{}", err)
        }
      }
      Err("failed to initialise unix socket listener")
    }
  }
}
