# CeiLED CLI (`ceiled`)

This is a simple CLI application written in Bash that can be used to install and control CeiLED. It is meant to be executed on the machine that is or will be hosting CeiLED and is thus mostly an administrative tool.

```
$ ceiled help
CeiLED CLI - version 0.0.1

Usage: ceiled [--debug] COMMAND

Options:
  --debug        Use CeiLED with the debug driver instead of the actual driver.

Commands:
  env            Edit the .env file for docker-compose.
  install DIR    Install CeiLED to directory DIR. Will be created if it doesn't exist. Requires sudo.
  start          Starts CeiLED in the background by calling 'docker-compose up -d'. Uses the docker-compose.debug.yml file when using --debug
  stop           Stops CeiLED.
  update         Updates CeiLED by downloading the latest versions of CeiLED's Docker containers.
  *              Prints this help
```
