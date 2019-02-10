# Controller API

The ceiLED controller listens to a JSON API over a WebSocket connection on port 6565. This document captures that JSON API.

---

## Sending a request

---

### Settings Request (set / get current settings)

The settings object has several properties, each pertaining to a different setting

| Property     | Required | Value                    | Description                                                                                                                                                                                                                                                           |
| ------------ | -------- | ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `action`     | yes      | `"get"` \| `"set"`       | The action to take: get the settings, or set the settings                                                                                                                                                                                                             |
| `brightness` | no       | 0 - 100                  | The brightness of the lights as a percentage. 0 is off, 100 is full brightness.                                                                                                                                                                                       |
| `roomLight`  | no       | 0 - 100                  | The amount of normal room lighting to mix in with the colours.                                                                                                                                                                                                        |
| `driverType` | no       | `"DEBUG"` \| `"PCA9685"` | The type of driver to use on the controller. The debug driver outputs to the console, wheras the PCA9685 driver interfaces with LED strips connected to a PCA9685 controller connected through an i2c-bus.                                                            |
| `flux`       | no       | -1, 0, 1, ... 5          | Flux setting on the controller. Flux is a feature that decreases the amount of blue light emitted based on the time of day; the later it is, the lower the amount of blue light. Values are -1 for automatic, 0 for off, 1 through 5 for individual flux intensities. |

#### GET Settings

Request:

```json
{
  "settings": {
    "action": "get"
  }
}
```

Response on success:

```json
{
  "status": "succes",
  "settings": {
    "action" : "get",
    "brightness": 65,
    "roomLight": 65,
    "driverType": "DEBUG" | "PCA9685",
    "flux": -1 | 0 | 1 | .. | 5
  }
}
```

Response on an internal error while processing the request:

```json
{
  "status": "error",
  "errors": [
    {
      "message": "Human-readable error message",
      "stackTrace": "Stack trace string"
    }
  ]
}
```

#### SET Settings

Request:

```json
{
  "settings": {
    "action": "set",
    "brightness": 65,
    "roomLight": 65,
    "driverType": "DEBUG" | "PCA9685",
    "flux": -1 | 0 | 1 | .. | 5
  },
  "authToken": "string"
}
```

Response:

```json
{
  "status": "succes"
}
```

---

### CeiLED Request (control lights)

---

In general, a request to set the LEDs to a specific pattern with specific colours looks as follows:

```json
{
  "data": {
    "type": "pattern type",
    "colors": [
      {
        "red": 65,
        "green": 65,
        "blue": 65
      }
    ],
    "patternOptions": {
      "optionName": "optionValue" // pattern specific
    }
  }
}
```

The request object should contain an object `data` that contains the request parameters. These parameters are outlined in the table below.

| Parameter        | Type      | Value description                                                                                                                                                                                                                                                                            |
| ---------------- | --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `type`           | `string`  | Pattern type (see [possible patterns](#possible-patterns)).                                                                                                                                                                                                                                  |
| `colors`         | `Color[]` | The base colours to be used in the pattern. The amount of colours that should be specified differs per type of pattern. A pattern might only use a maximum number of colours, but it should always be possible to specify more than that. The pattern will simply discard the extra colours. |
| `patternOptions` | `object`  | An object with pattern-specific options for a pattern. See [possible patterns](#possible-patterns).                                                                                                                                                                                          |

---

### Response from the server

---

In general a response from a request as previously described, looks as follows:

#### On success:

```json
{
  "status": "success"
}
```

#### On a problem with the request:

```json
{
  "status": "fail",
  "errors": [
    {
      "message": "Human-readable error message",
      "stackTrace": "Stack trace string"
    }
  ]
}
```

#### On an internal error while processing the request:

```json
{
  "status": "error",
  "errors": [
    {
      "message": "Human-readable error message",
      "stackTrace": "Stack trace string"
    }
  ]
}
```

---

### Possible patterns

---

This section lists the possible patterns, their pattern type and their available pattern options.

- [Solid](#solid-solid)
- [Jump](#jump-jump)
- [Fade](#fade-fade)
- [Mix](#mix)

#### Solid (`solid`)

A solid pattern statically displays one to three colours. The number of colours specified is equal to the amount of channels the colours are shown on. The `patternOptions` object is not used, so it can have any value, but preferably `undefined`.

##### patternOptions

Not used.

---

#### Jump (`jump`)

```
NOT YET IMPLEMENTED!!!
```

On a Jump pattern, the channels will jump over a number of colours, with a certain speed. The speed should be defined in beats per minute (BPM), which is in this case equal to jumps per minute.

The number of channels to use should also be specified. With 1 channel, all channels are seen as a whole and the whole room will jump across the specified colors.

With 2 channels, the outer two channels will be synchronised and jump across the colours specified in the original `colors` array. The middle channel will jump across the colours that need to be specified in the `colors2` array.

With 3 channels, every channel needs to have its own set of colours to jump across. The colours to be used for channel 1 should be specified in the original `colors` array, whereas the colours for channel 2 and 3 should be defined in `colors2` and `colors3` respectively in the `patternOptions`.

There are also several jump types, that determine how the jumps occur. See below for more info.

##### patternOptions

| Parameter  | Type       | Value description                                                                      |
| ---------- | ---------- | -------------------------------------------------------------------------------------- |
| `speed`    | `number`   | Amount of BPM that determines how fast the jumps happen.                               |
| `channels` | `number`   | Amount of channels to use.                                                             |
| `colors2`  | `Color[]`  | Secondary array of colours that needs to be filled when two or more channels are used. |
| `colors3`  | `Color[]`  | Ternary array of colours that needs to be filled in when three channels are used.      |
| `jumpType` | `JumpType` | Type of jump. See the values in the JumpType enum, described below.                    |

The JumpType enum has the following values, with the following descriptions.

| JumpType       | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `normal`       | Will always jump exactly on a beat. If multiple channels are defined, then all channels will jump at the same time, using their own respective colours.                                                                                                                                                                                                                                                                                                                                           |
| `line`         | Will always jump exactly on a beat. With one channel, this is the same as a normal jump. With two channels, the colours will jump from the outer channels, to the inner channel. With three channels, the colours will jump from channel 1 to channel 2 to channel 3, thus creating a sort of line. Technically only the original `colors` array is required for this, but if `colors2` and `colors3` are defined in the `patternOptions`, then those will be concatenated to the `colors` array. |
| `reverse-line` | Same as `line`, only in reverse.                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |

---

#### Fade (`fade`)

On a Fade pattern, the channels will fade over a number of colours, with a certain speed. The speed should be defined in beats per minute (BPM). The fade type determines whether a fade starts on the beat, or whether a fade starts in the middle of two beats, so the colour it will fade to is at its maximum brightness on a beat.

The number of channels to use should also be specified. With 1 channel, all channels are seen as a whole and the whole room will fade across the specified colors.

With 2 channels, the outer two channels will be synchronised and fade across the colours specified in the original `colors` array. The middle channel will fade across the colours that need to be specified in the `colors2` array.

With 3 channels, every channel needs to have its own set of colours to fade across. The colours to be used for channel 1 should be specified in the original `colors` array, whereas the colours for channel 2 and 3 should be defined in `colors2` and `colors3` respectively in the `patternOptions`.

There are also several fade types, that determine how the fades occur. See below for more info.

##### patternOptions

| Parameter       | Type                      | Value description                                                                                                                                                                                                                                               |
| --------------- | ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `speed`         | `number`                  | Amount of BPM that determines how fast the fades happen.                                                                                                                                                                                                        |
| `channels`      | `number`                  | Amount of channels to use.                                                                                                                                                                                                                                      |
| `colors2`       | `Color[]`                 | Secondary array of colours that needs to be filled when two or more channels are used.                                                                                                                                                                          |
| `colors3`       | `Color[]`                 | Ternary array of colours that needs to be filled in when three channels are used.                                                                                                                                                                               |
| `interpolation` | `"linear"` \| `"sigmoid"` | Type of interpolation function that the controller should use. When fading from one colour to another, this function determines how the two colours are mixed together over time. A sigmoid function may seem more natural, as it eases each colour in and out. |
| `fadeType`      | `FadeType`                | Type of fade. See the values in the FadeType enum, described below.                                                                                                                                                                                             |

The FadeType enum has the following values, with the following descriptions. _**Note that FadeType has not yet been implemented in the controller application.**_

| FadeType       | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `normal`       | Will always start a fade on a beat. If multiple channels are defined, then all channels will start their fade at the same time, using their own respective colours.                                                                                                                                                                                                                                                                                                                               |
| `inverted`     | Same as `NORMAL`, only the fades start in the middle of two beats.                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `line`         | Will always start a fade on a beat. With one channel, this is the same as a normal fade. With two channels, the colours will fade from the outer channels, to the inner channel. With three channels, the colours will fade from channel 1 to channel 2 to channel 3, thus creating a sort of line. Technically only the original `colors` array is required for this, but if `colors2` and `colors3` are defined in the `patternOptions`, then those will be concatenated to the `colors` array. |
| `reverse-line` | Same as `LINE`, only in reverse.                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |

---

#### Flash (`flash`)

```
NOT YET IMPLEMENTED!!!
```

Will flash a certain colour as if it is a stroboscope. The number of colours specified is equal to the amount of channels the colours are shown on.

The speed should be defined in beats per minute (BPM), where one flash takes exactly one beat. One flash is defined as one period of time that the light is on, plus one period of time that the light is off.

The percentage of time that the light spends on vs. the time it spends off can be defined as the `dutyCycle`. As it is a percentage, its value should be between 0 and 100.

##### patternOptions

| Parameter   | Type     | Value description                                                                                                                                                                       |
| ----------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `speed`     | `number` | Amount of BPM that determines how fast the flashes happen.                                                                                                                              |
| `dutyCycle` | `number` | Percentage of time the light spends on. Should be between 0 and 100%, where 0% is equal to lights completely off, and 100% is equal to lights completely on with the specified colours. |

---

#### Mix

To be specified...
