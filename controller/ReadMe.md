# LED Controller

Controller software for the LEDs.

## Prerequisites

This software is supposed to be run on the Up Squared.
1. NodeJS v8.0 or higher
2. [mraa](https://github.com/intel-iot-devkit/mraa#installing-on-ubuntu)
3. `npm install`

## Running the software

Use `sudo npm start` for development version. Relaunches on save.
In production, use `npm run build` to build, then `sudo npm run serve` to launch the server.

It is required to run the server as superuser, otherwise the LED driver will not have access to the LEDs.
