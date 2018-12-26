import { openSync } from "i2c-bus";
import Pca9685Driver, { Pca9685Options } from "pca9685";
import ChannelStore from "./hardware/ChannelStore";
import DebugDriver from "./hardware/DebugDriver";

export enum DriverType {
  PCA9685 = "PCA9685",
  DEBUG = "DEBUG"
}

export interface IControllerSettings {
  brightness: number;
  roomLight: number;
  flux: number;
  driverType: DriverType;
}

export class ControllerSettings {
  public brightness: number;
  public roomLight: number;
  public flux: number;
  public channelStore: ChannelStore;
  
  private driver: Pca9685Driver | DebugDriver;

  constructor({ brightness, roomLight, flux, driverType }: IControllerSettings) {
    this.brightness = brightness;
    this.roomLight = roomLight;
    this.flux = flux;
    this.channelStore = new ChannelStore();
    this.setDriver(driverType).catch((error: any) => {
      console.error("Failed to initialise PCA9685Driver");
      console.error(error);

      this.setDriver(DriverType.DEBUG).catch((error2: any) => {
        console.error("Something must've really gone wrong, because I can't initialise the debug driver");
        console.error(error2);
      });
    });
  }

  public setDriver(type: DriverType): Promise<void> {
    return new Promise((resolve, reject) => {
      if (type === DriverType.DEBUG) {
        printUsingDebug();
        this.driver = new DebugDriver();
        return resolve();
      } else if (type === DriverType.PCA9685) {
        const options: Pca9685Options = {
          i2c: openSync(5),
          address: 0x40,
          frequency: 1000,
          debug: false
        };
        if (this.driver) printUsingPca9685();
        this.driver = new Pca9685Driver(options, (error: any) => error ? reject(error) : resolve());
      }
    })
  }

  public getDriver(): Pca9685Driver | DebugDriver {
    return this.driver;
  }
}

const printUsingDebug = (): void => {
  if (process.env.TEST) return;
  console.warn(".--------------------------.")
  console.warn("|-------- WARNING! --------|");
  console.warn("|-----       -        -----|");
  console.warn("|--- Pin driver changed ---|");
  console.warn("|- Now using: DebugDriver -|");
  console.warn("'--------------------------'");
}

const printUsingPca9685 = (): void => {
  if (process.env.TEST) return;
  console.warn(".--------------------------.")
  console.warn("|-------- WARNING! --------|");
  console.warn("|-----       -        -----|");
  console.warn("|--- Pin driver changed ---|");
  console.warn("| Now using: PCA9685Driver |");
  console.warn("'--------------------------'");
}
