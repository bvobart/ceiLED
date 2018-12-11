import { DriverType } from "../../ControllerSettings";

export class SettingsRequest {
  public static isRequest(x: any): x is Request {
    return typeof x.brightness === 'number'
        && typeof x.roomLight === 'number'
        && typeof x.driver === 'string'
        && typeof x.flux === 'number';
  }

  public brightness: number;
  public roomLight: number;
  public driver: DriverType;
  public flux: number;

  constructor(brightness: number, roomLight: number, driver: DriverType, flux: number) {
    this.brightness = brightness;
    this.roomLight = roomLight;
    this.driver = driver
    this.flux = flux;
  }
}