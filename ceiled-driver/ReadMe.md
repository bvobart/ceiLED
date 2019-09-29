# ceiled-driver


## Quick start

Make sure you have [Rust](https://www.rust-lang.org) and Cargo installed. Then from the same directory as this file, run: `cargo run -- --debug`

A Unix socket file `ceiled.sock` should appear in this folder. For quick commandline debugging, connect to it using `nc -U ceiled.sock`

```
USAGE:
    ceiled-driver [FLAGS] [OPTIONS]

FLAGS:
        --debug      Enables the debug driver
    -h, --help       Prints help information
    -V, --version    Prints version information

OPTIONS:
        --pca9685 <pca9685>    Enables the PCA9685 driver. Please specify the location of this device on the filesystem,
                               e.g. /dev/i2c-5
```

### Docker

Building the image: `docker build -t ceiled-driver .`

Running the image:
- `docker run -e ARGS="--debug" ceiled-driver .`

or if you want to use the pca9685 driver, mount it using the `--device` option:
- `docker run --device /dev/i2c-5 -e ARGS="--pca9685 /dev/i2c-5" ceiled-driver .`

## API

Every one of the following requests can be preceded with `id NUM` where NUM is any integer number. The response to this request will also be preceded with `id NUM`.

### Getting / Setting brightness, roomlight and flux

Getting:
- `get brightness`: Gets the brightness level
- `get roomlight`: Gets the roomlight adjustment level
- `get flux`: Gets the flux level

Setting:
- `set brightness NUM`: Sets the brightness to NUM. NUM can be any number between 0 and 255
- `set roomlight NUM`: Sets the roomlight adjustment to NUM. NUM can be any number between 0 and 255, where 0 is no roomlight adjustment and 255 is complete roomlight.
- `set flux FLUX`: Sets the flux level to FLUX. FLUX can be anywhere between 0 and 5, where 0 is no blue light reduction, and 1 through 5 are the five levels of flux that can be applied, level 5 being the most blue light reduction.

### Getting / Setting colours

Setting:
- `set TARGET solid RED GREEN BLUE`: sets the target channel(s) to the colour specified by the RGB values.
- `set TARGET solid RED GREEN BLUE, TARGET solid RED GREEN BLUE, TARGET solid RED GREEN BLUE` ... : sets multiple target channels to their respective colours.
- `set TARGET fade RED GREEN BLUE MILLIS INTERPOLATION`: sets the target channel(s) to fade from their current colour to the target colour specified by the RGB values. This fade will take MILLIS milliseconds to complete and use the specified interpolation type (linear or sigmoid).
- `set TARGET fade RED GREEN BLUE MILLIS INTERPOLATION, TARGET fade RED GREEN BLUE MILLIS INTERPOLATION, TARGET fade RED GREEN BLUE MILLIS INTERPOLATION` ... : sets multiple target channels to fade from their current colour to the target colours specified by the RGB values. This fade will take MILLIS milliseconds to complete and use the specified interpolation type (linear or sigmoid). Will use the last millis and interpolation type specified. Specifying fades that take different amounts of time is not supported yet.

Keywords:
- `TARGET` = all | 0 | 1 | 2 | ... | n (where n is the amount of channels that are available on the device) | 0,2,3 (comma separated channel numbers up to n)
- `RED` = `GREEN` = `BLUE` = red, green or blue value, within 0 and 255
- `MILLIS` = fade duration in milliseconds
- `INTERPOLATION` = `linear` or `sigmoid`.


Examples:
- `set all solid 255 255 255`
- `set 1 solid 255 255 255`
- `set all fade 255 0 255 500 linear`
- `set all fade 255 0 255 800 linear, 1 fade 0 255 0 1000 sigmoid` Result: fade to magenta on 0 and 2, fade to green on 1. Both in 1000 ms using sigmoid interpolation.
- `set all fade 255 0 255 500 sigmoid, 1 solid 0 0 0` Result: 500 ms long sigmoid fade to magenta on 0 and 2, solid black on 1.

Future:
- Use this for DEBUG driver (or just run it in a terminal that is not VSCode's): https://gist.github.com/AndrewJakubowicz/9972b5d46be474c186a2dc3a71326de4
