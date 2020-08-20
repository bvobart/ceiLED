# [CeiLED](https://bart.vanoort.is)

Repository for the software written in order to control the LED strips on my room's ceiling. The software consists of three distinct parts:

- `ceiled-web`: a ReactJS website that serves as a remote control for displaying cool RGB colour patterns on the LED strips. Recently rewritten with using the amazing React hooks, TypeScript and MaterialUI v4.
- `ceiled-server`: a TypeScript NodeJS web server that hosts a JSON WebSocket API and connects to a MongoDB database for authorisation. It is what `ceiled-web` talks to in order to show its cool colours, and it is what carefully exposes `ceiled-driver` to the internet.
- `ceiled-driver`: a low-level hardware driver written in Rust. This is what actually controls the LED strips. It accepts a simple yet powerful API through a UNIX socket. In the future, I want to set it up as a native module NPM package, so that `ceiled-server` can use its API directly instead of as a separate process through a Unix socket.

Branch  | Build status
--------|--------
master  | [![Build Status](https://travis-ci.com/bvobart/ceiLED.svg?branch=master)](https://travis-ci.com/bvobart/ceiLED)
develop | [![Build Status](https://travis-ci.com/bvobart/ceiLED.svg?branch=develop)](https://travis-ci.com/bvobart/ceiLED)

## Quick start for production

To get this system running in production, you'll need:

- Docker
- Docker Compose
- Preferred: a PCA9685 controller on `/dev/i2c-5`

Set up a `.env` file with any custom environment variables if you need them, then run the following commands in this directory:

```sh
docker-compose build
docker-compose up # -d to run in background
```

You can also add the option `-f docker-compose.debug.yml` to both of those `docker-compose` commands to run `ceiled-driver` with its debug driver. A PCA9685 controller will not be necessary in this case.

Per default, CeiLED binds to both port `80`, `443` and `6565`. CeiLED will also try to acquire SSL certificates using LetsEncrypt for the configured `SITE_ADDRESS` and `API_ADDRESS`,
as long as they are not `localhost` or addresses on LAN, including `.local` addresses.

## Environment variables

Environment variables can best be passed through a `.env` file; place it next to the `docker-compose.yml` file in this repository and fill in any necessary environment variables.
These are the environment variables that can be configured

Variable Name   | Default value     | Description
----------------|-------------------|----------------
`DEV_PCA9685`   | `/dev/i2c-5`      | i2c device file of a PCA9685 controller. Not supported if using debug driver
`HTTP_PORT`     | `80`              | Host machine port on which to listen for HTTP requests
`HTTPS_PORT`    | `443`             | Host machine port on which to listen for HTTPS requests
`API_PORT`      | `6565`            | Host machine port for when the API is not hosted through the same port as HTTP or HTTPS.
`SITE_ADDRESS`  | `localhost`       | Hostname on which ceiled-web will be hosted. Append `:80` to explicitly disable HTTPS.
`API_ADDRESS`   | `api.localhost`   | Hostname on which the ceiled API will be hosted. Append `:80` to explicitly disable HTTPS.
`SITE_ACCESS_POLICY` | `lan`        | By default, CeiLED only allows you to connect to the website from devices on your LAN. Set this to `public` to allow public access to CeiLED's website.
`API_ACCESS_POLICY` | `lan`         | By default, CeiLED only allows you to connect to the API from devices on your LAN. Set this to `public` to allow public access to CeiLED's API.

## Quick start for development

For a quickstart, open three terminals and run the following commands. By default, everything should be set up to "just work"&trade; See the individual ReadMe's if there's something wrong, or if you want to set a custom environment variable.

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

