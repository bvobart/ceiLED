export class ControllerRequestBuilder {
  type;
  brightness;
  roomLight;
  colors;
  patternOptions;

  constructor() {
    this.colors = [];
    this.patternOptions = {}
  }

  setType(type) {
    this.type = type;
    return this;
  }

  setBrightness(brightness) {
    this.brightness = brightness;
    return this;
  }

  setRoomlight(roomLight) {
    this.roomLight = roomLight;
    return this;
  }

  setColors(colors) {
    this.colors = colors;
    return this;
  }

  setPatternOptions(options) {
    this.patternOptions = options;
    return this;
  }

  build() {
    return {
      data: {
        type: this.type,
        brightness: this.brightness,
        roomLight: this.roomLight,
        colors: this.colors,
        patternOptions: this.patternOptions,
      }
    }
  }
}

export default ControllerRequestBuilder;
