export class SettingsRequestBuilder {
  action;
  brightness;
  roomLight;
  flux;
  driver;

  authToken;

  setAuthToken(token) {
    this.authToken = token;
    return this;
  }

  setAction(action) {
    this.action = action;
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

  setFlux(flux) {
    this.flux = flux;
    return this;
  }

  setDriver(driver) {
    this.driver = driver;
    return this;
  }

  build() {
    return {
      settings: {
        action: this.action,
        brightness: this.brightness,
        roomLight: this.roomLight,
        flux: this.flux,
        driver: this.driver
      },
      authToken: this.authToken
    }
  }
}

export default SettingsRequestBuilder;
