# [CeiLED](https://bart.vanoort.is)

Repository for the software written in order to control the LED strips on my room's ceiling. The software consists of three distinct parts:

- `ceiled-web`: a ReactJS website that serves as a remote control for displaying cool RGB colour patterns on the LED strips. Recently rewritten using the amazing React hooks, TypeScript and MaterialUI v4.
- `ceiled-server`: a TypeScript NodeJS web server that hosts a recently rewritten socket.io WebSocket API and connects to a MongoDB database for authorisation. It is what `ceiled-web` talks to in order to show its cool colours, and it is what carefully exposes `ceiled-driver` to the internet.
- `ceiled-driver`: a low-level hardware driver written in Rust. This is what actually controls the LED strips. It accepts a simple yet powerful API through a UNIX socket. In the future, I want to set it up as a native module NPM package, so that `ceiled-server` can use its API directly instead of as a separate process through a Unix socket.

Finally, to bring it all together, to help with installing and managing your installation, there's `ceiled-cli`, a small but very useful command-line utility written in Bash. 

Branch  | Build status
--------|--------
master  | [![pipeline status](https://gitlab.com/bvobart/ceiled/badges/master/pipeline.svg)](https://gitlab.com/bvobart/ceiled/-/commits/master)
develop | [![pipeline status](https://gitlab.com/bvobart/ceiled/badges/develop/pipeline.svg)](https://gitlab.com/bvobart/ceiled/-/commits/develop)


## Quick start

To get CeiLED running in production, you'll need:

- Docker
- Docker Compose
- Preferred: a PCA9685 controller on `/dev/i2c-5`

Clone this repository and use the `ceiled` CLI tool to install CeiLED to a directory of your liking. This is easily done by running the following commands, replacing `DIRECTORY` with the directory where you want to install CeiLED.
```sh
git clone --depth 1 https://github.com/bvobart/ceiLED.git
./ceiled-cli/ceiled install DIRECTORY
```

The installation script will guide you through the rest.

Per default, CeiLED binds to ports `80`, `443` and `6565`, though this can be changed using environment variables. 
CeiLED will also try to acquire SSL certificates using LetsEncrypt for the configured `SITE_ADDRESS` and `API_ADDRESS`,
as long as they are not `localhost` or addresses on LAN, including `.local` addresses.


## Environment variables

Environment variables can best be passed through a `.env` file; use `ceiled env` to create and edit this file, or create it yourself by copying the sample `.env.sample` file, then place that next to the `docker-compose.yml` file in this repository and fill in any necessary environment variables.

These are the environment variables that can be configured

Variable Name   | Default value     | Description
----------------|-------------------|----------------
`DEV_PCA9685`   | `/dev/i2c-5`      | i2c device file of a PCA9685 controller. Not supported if using debug driver
`HTTP_PORT`     | `80`              | Host machine port on which to listen for HTTP requests
`HTTPS_PORT`    | `443`             | Host machine port on which to listen for HTTPS requests
`API_PORT`      | `6565`            | Host machine port for when the API is not hosted through the same port as HTTP or HTTPS.
`SITE_ADDRESS`  | `localhost`       | Hostname on which ceiled-web will be hosted. Append `:80` to explicitly disable HTTPS. You could also use an IP address here, such as `192.168.0.65` or `192.168.0.101:6565`.
`API_ADDRESS`   | `api.localhost`   | Hostname on which the ceiled API will be hosted. Append `:80` to explicitly disable HTTPS. You could also use an IP address here, such as `192.168.0.65` or `192.168.0.101:6565`.
`SITE_ACCESS_POLICY` | `lan`        | By default, CeiLED only allows you to connect to the website from devices on your LAN. Set this to `public` to allow public access to CeiLED's website.
`API_ACCESS_POLICY` | `lan`         | By default, CeiLED only allows you to connect to the API from devices on your LAN. Set this to `public` to allow public access to CeiLED's API.


## Quick start for building from source

To get CeiLED running in a production environment, but built from source, use the following commands:
```sh
# If you want to build CeiLED from source
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up

# If you want to build CeiLED from source AND want to use the debug driver:
docker-compose -f docker-compose.yml -f docker-compose.dev.yml -f docker-compose.debug.yml up
```

You can still use `./ceiled-cli/ceiled env` to edit your environment variables file. 


## Quick start for development

To get a development environment running for CeiLED, open three terminals and run the following commands. By default, everything should be set up to "just work"&trade; without the need for custom environment variables. See the individual ReadMe's if there's something wrong, or if you want to set a custom environment variable.

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
