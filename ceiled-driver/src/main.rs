#![allow(non_snake_case)]
#[macro_use] extern crate crossbeam_channel;
#[macro_use] extern crate lalrpop_util;
#[macro_use] extern crate lazy_static;
extern crate cancellation;
extern crate clap;
extern crate crossterm;
extern crate ctrlc;
extern crate parking_lot;

pub mod ceiled;
pub mod colors;
mod command;
mod debug;
mod manager;
mod pca9685;

use debug::{ DebugDriver };
use pca9685::{ CeiledPca9685 };
use manager::DriverManager;

use clap::{ App, Arg, ArgMatches };
use crossterm::{ Colored, Crossterm };
use crossbeam_channel::{ bounded };
use parking_lot::{ Mutex };

use std::fs;
use std::io::prelude::*;
use std::io::{ ErrorKind, BufRead, BufReader };
use std::os::unix::net::{ UnixListener, UnixStream };
use std::sync::{ Arc };
use std::thread;
use std::thread::sleep;
use std::time::{ Duration };

static VERSION: &'static str = "0.1.0";

lalrpop_mod!(pub api);

lazy_static! {
  static ref CTERM: Crossterm = Crossterm::new();
}

/**
 * Initialize the drivers.
 */
fn initDrivers(args: &ArgMatches) -> Vec<Arc<Mutex<DriverManager>>> {
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
    .arg(Arg::with_name("socketFile")
      .long("socketFile")
      .help("Specifies where to place the Unix socket file")
      .takes_value(true)
      .default_value("./ceiled.sock"))
    .get_matches();

  println!("{}-> CeiLED driver starting...", Colored::Bg(crossterm::Color::Reset));
  enableDeadlockDetection();

  // make list of enabled drivers.
  let drivers = initDrivers(&args);
  if drivers.is_empty() {
    return Err("No drivers were successfully initialised")
  }

  for driver in drivers.clone() {
    driver.lock().get().init().expect("driver failed to perform initialisation");
  }

  // set up ctrl-c handler.
  let (notifyExit, exit) = bounded(1);
  ctrlc::set_handler(move || { notifyExit.send(()).unwrap(); }).expect("failed to set ctrl-c handler");

  // set up ceiled.sock listener
  let sockListener = initSocketListener(args.value_of("socketFile").unwrap())?;
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
          let parser = api::CommandParser::new();

          // on receiving new command from the socket
          for l in reader.lines() {
            let mut responder = StreamResponder::new(stream);

            // parse the command
            let line = l.unwrap();
            let command = match parser.parse(&line) {
              Ok(c) => c,
              Err(err) => {
                println!("{}invalid command given: {}, command: {}", Colored::Bg(crossterm::Color::Reset), err, line);
                responder.send(format!("error: invalid command: {}", err));
                continue;
              }
            };

            println!("{}Command: {:?}", Colored::Bg(crossterm::Color::Reset), &command);

            // for each active driver
            for driver in drivers.clone() {
              // execute the command
              match driver.lock().execute(&command) {
                Err(err) => { 
                  println!("{}{}Error applying command: {}", Colored::Bg(crossterm::Color::Reset), Colored::Fg(crossterm::Color::Red), err);
                  responder.send(idString(command.id()) + "error: " + &err);
                },
                Ok(Some(msg)) => {
                  responder.send(idString(command.id()) + &msg);
                }
                Ok(None) => {},
              }
            }
          }

          println!("-> Connection closed")
        });
      },

      // on ctrl-c, exit.
      recv(exit) -> _ => break
    }
  }

  println!("{}", Colored::Bg(crossterm::Color::Reset));
  println!("-> CeiLED driver stopping.");

  for driver in drivers.clone() {
    let mut drv = driver.lock();
    match drv.get().off() {
      Ok(())   => println!("-> Device stopped: {}", drv.get().name()),
      Err(err) => println!("-> Failed to properly turn off a driver: {}", err)
    }
  }
  fs::remove_file(args.value_of("socketFile").unwrap()).expect("cannot remove unix socket");

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
        fs::remove_file(address).expect("failed to remove socket");
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
}

impl<'a> StreamResponder<'a> {
  fn new(stream: &'a UnixStream) -> Self {
    return StreamResponder { stream }
  }

  fn send(&mut self, response: String) {
    let res = response + "\n";
    match self.stream.write_all(res.as_bytes()) {
      Ok(()) => {},
      Err(err) => { 
        println!("{}{}Error sending response message: {}", Colored::Bg(crossterm::Color::Reset), Colored::Fg(crossterm::Color::Red), err); 
      }
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

fn idString(id: Option<usize>) -> String {
  match id {
    None => "".to_owned(),
    Some(i) => "id ".to_owned() + &i.to_string() + " ",
  }
}
