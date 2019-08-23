# [CeiLED](https://bart.vanoort.is)

Repository for the software written in order to control the LED strips on my room's ceiling. The software consists of a low-level hardware driver written in Rust called `ceiled-driver`, a TypeScript NodeJS webserver `ceiled-server` that hosts the JSON WebSocket API, and a ReactJS web interface `ceiled-web` that serves as a remote control for displaying cool RGB colour patterns on the LED strips.

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

### Quick start for production

To get this system running in production, you'll need:

- Docker
- Docker Compose
- Access to a MongoDB database

Then create a `.env` file in this folder, and fill in any necessary environment variables. Here's an example:
```
INSECURE="true"
DB_HOST=192.168.0.123
DB_NAME=ceiled
DB_AUTH=admin
DB_USERNAME=dbuser
DB_PASSWORD=dbpass
```

or replace `INSECURE="true"` with `HTTPS_FILES=https` in order to specify that the `ceiled-server` should use the `localhost.key.pem` and `localhost.cert.pem` HTTPS key and certificate files in the `https` directory.

- `docker compose up --build`
