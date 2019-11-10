# [CeiLED](https://bart.vanoort.is)

Repository for the software written in order to control the LED strips on my room's ceiling. The software consists of three distinct parts:

- `ceiled-web`: a ReactJS website that serves as a remote control for displaying cool RGB colour patterns on the LED strips.
- `ceiled-server`: a TypeScript NodeJS web server that hosts a JSON WebSocket API and connects to a MongoDB database for authorisation. It is what `ceiled-web` talks to in order to show its cool colours, and it is what carefully exposes `ceiled-driver` to the internet.
- `ceiled-driver`: a low-level hardware driver written in Rust. This is what actually controls the LED strips. It accepts a simple yet powerful API through a UNIX socket.

Branch  | Build status
--------|--------
master  | [![Build Status](https://travis-ci.com/bvobart/ceiLED.svg?branch=master)](https://travis-ci.com/bvobart/ceiLED)
develop | [![Build Status](https://travis-ci.com/bvobart/ceiLED.svg?branch=develop)](https://travis-ci.com/bvobart/ceiLED)

## Quick start for development

See the individual ReadMe's. For a quickstart, open three terminals and run:

#### ceiled-driver
- `cd ceiled-driver`
- `cargo run -- --debug`

#### ceiled-server
- `cd ceiled-server`
- `yarn install`
- `yarn start`

#### ceiled-web
- `cd ceiled-web`
- `yarn install`
- `yarn start`

## Quick start for production

To get this system running in production, you'll need:

- Docker
- Docker Compose
- Access to a MongoDB database

Then create a `.env` file, place it next to the `docker-compose.yml` file in this repository and fill in any necessary environment variables. Here's an example:
```
INSECURE="true"
DB_HOST=192.168.0.123
DB_NAME=ceiled
DB_AUTH=admin
DB_USERNAME=dbuser
DB_PASSWORD=dbpass
```

or replace `INSECURE="true"` with `HTTPS_FILES=https` in order to specify that the `ceiled-server` should use the `localhost.key.pem` and `localhost.cert.pem` HTTPS key and certificate files in the `https` directory.

- `docker compose up --build -d`

## Install scripts

I'm working on some installation scripts to make it much easier for others to start using the CeiLED suite and keep it up to date. I will update this ReadMe once they are in this repository.
