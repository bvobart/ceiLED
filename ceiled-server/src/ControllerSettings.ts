import Pattern from './patterns/Pattern';

export const test = process.env.TEST || false;
export const debug = process.env.DEBUG || false;

export enum DriverType {
  PCA9685 = 'PCA9685',
  DEBUG = 'DEBUG',
}

export interface IControllerSettings {
  brightness: number;
  roomLight: number;
  flux: number;
}

export class ControllerSettings implements IControllerSettings {
  public activePattern: Pattern;

  public brightness: number;
  public roomLight: number;
  public flux: number;

  constructor({ brightness, roomLight, flux }: IControllerSettings) {
    this.brightness = brightness;
    this.roomLight = roomLight;
    this.flux = flux;
  }
}

// Application wide controller settings
export const defaultSettings: ControllerSettings = new ControllerSettings({
  brightness: 100,
  roomLight: 0,
  flux: -1,
});
export let settings: ControllerSettings = defaultSettings;
