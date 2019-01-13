# LED Controller

Controller software for the LEDs. The controller hosts the JSON WebSocket API and controls the LED strips through the pin driver.

## Prerequisites

This software is supposed to be run on the Up Squared.

1. NodeJS v8.0 or higher (just get latest)
2. `yarn install`

## Running the software

When you do not have access to the I2C bus, or are not developing on the target machine, you can set the `DEBUG` environment variable to launch the controller with the debug driver, which prints pretty colours to the console :) If the controller fails to connect to a PCA9685 controller connected through the I2C bus, then it will also automatically switch over to the debug driver.

If you do have access to the I2C bus, you most likely need to have superuser rights, so use `sudo yarn start` for development. In production, use `yarn build` to build, then `sudo yarn serve` to launch the server, or serve the contents of the `build` folder through e.g. Nginx.
