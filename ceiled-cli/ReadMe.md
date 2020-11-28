# CeiLED CLI (`ceiled`)

This is a simple CLI application written in Bash that can be used to install and control CeiLED. It is meant to be executed on the machine that is or will be hosting CeiLED and is thus mostly an administrative tool.

```
$ ceiled help
CeiLED CLI - version 1.0.0

Usage: ceiled [--dir DIR] [--dev] COMMAND

Options:
  --dir DIR             Apply the commands to the CeiLED installation in DIR.
                        Useful if you have multiple installations of CeiLED.
  --dev                 Build CeiLED from source. Must be used from within the original Git repository.

Commands:
  auth add|remove|list  Manage authorisation tokens. See 'ceiled auth help'
  env                   Edit the .env file for docker-compose.
  build                 Build CeiLED's Docker containers from source. 
                        Must be used from within the original Git repository and implies --dev
  install DIR REF?      Install CeiLED to directory DIR. Will be created if it doesn't exist.
                        Define REF as a Git reference (e.g. the branch 'develop') to install
                        a different version of CeiLED. 
  logs ARGS?            Shows the latest of CeiLED's logs. Any arguments passed to this command 
                        will be passed to the underlying 'docker-compose logs'.
  restart all|driver|   Restarts CeiLED or starts CeiLED if it is not yet running. 
          web|server|   Uses a rolling update mechanism for the driver, server and MongoDB,
          mongodb       so those will have no downtime.
  start                 Starts CeiLED in the background by calling 'docker-compose up -d'.
  status                Prints the status of all running CeiLED Docker containers.
  stop                  Stops CeiLED by calling 'docker-compose down'.
  update                Updates CeiLED by downloading the latest versions of CeiLED's Docker containers.
  *                     Prints this help
```
