# ceiled-driver

## API

### Setting colours

- `set TARGET solid RED GREEN BLUE`: sets the target channel(s) to the colour specified by the RGB values.
- `set TARGET fade RED GREEN BLUE MILLIS INTERPOLATION?`: sets the target channel(s) to fade from their current colour to the target colour specified by the RGB values. This fade will take MILLIS milliseconds to complete and use the specified interpolation type (linear or sigmoid, defaults to linear).

Keywords:
- `TARGET` = all | 0 | 1 | 2 | ... | n (where n is the amount of channels that are available on the device) | 0,2,3 (comma separated channel numbers up to n)
- `RED` = `GREEN` = `BLUE` = red, green or blue value, within 0 and 255
- `MILLIS` = fade duration in milliseconds
- `INTERPOLATION` = `linear` or `sigmoid`. Optional, defaults to linear.


Examples:
- `set all solid 255 255 255`
- `set 1 solid 255 255 255`
- `set all fade 255 0 255 500`
- `set all fade 255 0 255 500 sigmoid`

TODO:
- getting colours
- Use this for DEBUG driver: https://gist.github.com/AndrewJakubowicz/9972b5d46be474c186a2dc3a71326de4
- Use Unix domain socket instead of named pipe: http://kmdouglass.github.io/posts/a-simple-unix-socket-listener-in-rust/