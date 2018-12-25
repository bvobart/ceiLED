export class CeiledRequestBuilder {
  type;
  brightness;
  roomLight;
  colors;
  patternOptions;

  authToken;

  constructor() {
    this.colors = [];
    this.patternOptions = {}
  }

  setAuthToken(token) {
    this.authToken = token;
    return this;
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
      },
      authToken: this.authToken
    }
  }
}

export default CeiledRequestBuilder;
