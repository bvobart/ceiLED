#![allow(non_snake_case)]
#[macro_use] extern crate lazy_static;
#[macro_use] extern crate crossbeam_channel;
extern crate cancellation;
extern crate clap;
extern crate crossterm;
extern crate ctrlc;
extern crate parking_lot;

mod ceiled;
mod colors;
mod commands;
mod debug;
mod manager;
mod pca9685;

use commands::{ Command };
use debug::{ DebugDriver };
use pca9685::{ CeiledPca9685 };
use manager::DriverManager;

use clap::{ App, Arg, ArgMatches };
use crossterm::{ Colored, Crossterm };
use crossbeam_channel::{ bounded };

use std::fs;
use std::io::prelude::*;
use std::io::{ ErrorKind, BufRead, BufReader };
use std::os::unix::net::{ UnixListener, UnixStream };
use std::sync::{ Arc, Mutex };
use std::thread;
use std::thread::sleep;
use std::time::{ Duration };

static SOCKET_PATH: &'static str = "ceiled.sock";
static VERSION: &'static str = "0.1.0";

lazy_static! {
  static ref CTERM: Crossterm = Crossterm::new();
}

/**
 * Initialize the drivers.
 */
fn initDrivers(args: ArgMatches) -> Vec<Arc<Mutex<DriverManager>>> {
  let mut drivers = Vec::new();

  if let Some(location) = args.value_of("pca9685") {
    let drvCeiled = CeiledPca9685::new(location.to_owned(), 3);

    if drvCeiled.is_err() {
      let err = drvCeiled.err().unwrap();
      println!("{}{}-> Error: Failed to initialise CeiledPca9685 driver: {}", Colored::Bg(crossterm::Color::Reset), Colored::Fg(crossterm::Color::Red), err);
    } else {
      let drvCeiled = Arc::new(Mutex::new(DriverManager::new(Box::new(drvCeiled.unwrap()))));
      println!("{}{}-> CeiledPca9685 driver connected!", Colored::Bg(crossterm::Color::Reset), Colored::Fg(crossterm::Color::Green));
      drivers.push(drvCeiled);
    }
  }

  if args.is_present("debug") {
    let drvDebug = Arc::new(Mutex::new(DriverManager::new(Box::new(DebugDriver::new(&CTERM, 3)))));
    println!("{}{}-> Debug driver enabled!", Colored::Bg(crossterm::Color::Reset), Colored::Fg(crossterm::Color::Green));
    drivers.push(drvDebug);
  }

  return drivers;
}

fn main() -> Result<(), &'static str> {
  let args = App::new("ceiled-driver")
    .version(VERSION)
    .author("Bart van Oort")
    .about("Rust driver for the CeiLED system")
    .arg(Arg::with_name("debug")
      .long("debug")
      .help("Enables the debug driver"))
    .arg(Arg::with_name("pca9685")
      .long("pca9685")
      .help("Enables the PCA9685 driver. Please specify the location of this device on the filesystem, e.g. /dev/i2c-5")
      .takes_value(true))
    .get_matches();

  println!("{}-> CeiLED driver starting...", Colored::Bg(crossterm::Color::Reset));
  enableDeadlockDetection();

  // make list of enabled drivers.
  let drivers = initDrivers(args);
  if drivers.is_empty() {
    return Err("No drivers were successfully initialised")
  }

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

  println!("{}{}-> Listening for commands...", Colored::Bg(crossterm::Color::Reset), Colored::Fg(crossterm::Color::Reset));

  // main loop
  loop {
    select! {
      // on receiving new stream, spawn new thread to handle the stream
      recv(streams) -> stream => {
        println!("-> New connection opened");
        let drivers = drivers.clone();
        thread::spawn(move || {
          let stream = &stream.unwrap();
          let reader = BufReader::new(stream);
          // on receiving new command from the socket
          for l in reader.lines() {
            let mut responder = StreamResponder::new(stream);

            // parse the command
            let line = l.unwrap();
            let command = match Command::parse(&line) {
              Ok(c) => c,
              Err(err) => {
                println!("{}invalid command given: {}, command: {}", Colored::Bg(crossterm::Color::Reset), err, line);
                responder.add(format!("error: invalid command: {}", err));
                responder.send();
                continue;
              }
            };

            println!("{}Command: {:?}", Colored::Bg(crossterm::Color::Reset), &command);

            // for each active driver
            for driver in drivers.clone() {
              // execute the command
              match driver.lock().unwrap().execute(&command) {
                Err(err) => { 
                  println!("{}{}Error applying command: {}", Colored::Bg(crossterm::Color::Reset), Colored::Fg(crossterm::Color::Red), err);
                  responder.add("error: ".to_owned() + &err);
                },
                Ok(None) => {},
                Ok(Some(msg)) => {
                  responder.add(msg);
                }
              }
            }

            responder.send();
          }
        });
      },
      // on ctrl-c, exit.
      recv(exit) -> _ => break
    }
  }

  println!("{}", Colored::Bg(crossterm::Color::Reset));
  println!("-> CeiLED driver stopping.");

  for driver in drivers.clone() {
    let mut drv = driver.lock().unwrap();
    match drv.get().off() {
      Ok(())   => println!("-> Device stopped: {}", drv.get().name()),
      Err(err) => println!("-> Failed to properly turn off a driver: {}", err)
    }
  }
  fs::remove_file(SOCKET_PATH).expect("cannot remove ceiled.sock");

  println!("-> CeiLED driver stopped.");
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

struct StreamResponder<'a> {
  stream: &'a UnixStream,
  responses: Vec<String>,
}

impl<'a> StreamResponder<'a> {
  fn new(stream: &'a UnixStream) -> Self {
    let responses = Vec::new();
    return StreamResponder { stream, responses }
  }

  fn add(&mut self, response: String) {
    self.responses.push(response);
  }

  fn send(&mut self) {
    let mut finalRes = "ok";
    for res in &self.responses {
      if res == "ok" { continue }
      finalRes = res;
    }

    let finalRes = finalRes.to_owned() + "\n";
    match self.stream.write_all(finalRes.as_bytes()) {
      Ok(()) => {},
      Err(err) => { println!("{}{}Error sending response message: {}", Colored::Bg(crossterm::Color::Reset), Colored::Fg(crossterm::Color::Red), err); }
    }
  }
}

fn enableDeadlockDetection() {
  #[cfg(feature="deadlock_detection")] {
    use parking_lot::deadlock;

    // Create a background thread which checks for deadlocks every 10s
    thread::spawn(move || {
        println!("-> Deadlock detection enabled!");
        loop {
            thread::sleep(Duration::from_secs(10));
            let deadlocks = deadlock::check_deadlock();
            if deadlocks.is_empty() {
                continue;
            }

            println!("-> {} deadlocks detected", deadlocks.len());
            for (i, threads) in deadlocks.iter().enumerate() {
                println!("-> Deadlock #{}", i);
                for t in threads {
                    println!("-> Thread Id {:#?}", t.thread_id());
                    println!("-> {:#?}", t.backtrace());
                }
            }
        }
    });
  }
}