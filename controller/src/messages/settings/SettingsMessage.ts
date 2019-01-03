import { ControllerSettings, DriverType } from '../../ControllerSettings';
import DebugDriver from '../../hardware/DebugDriver';

export class SettingsMessage {
  public static buildGet(settings: ControllerSettings): SettingsMessage {
    return new SettingsMessage(
      'get',
      settings.brightness,
      settings.roomLight,
      settings.getDriver() instanceof DebugDriver ? DriverType.DEBUG : DriverType.PCA9685,
      settings.flux,
    );
  }

  public static isMessage(x: any): x is SettingsMessage {
    return (
      typeof x.action === 'string' &&
      (!x.brightness || typeof x.brightness === 'number') &&
      (!x.roomLight || typeof x.roomLight === 'number') &&
      (!x.driver || typeof x.driver === 'string') &&
      (!x.flux || typeof x.flux === 'number')
    );
  }

  public action: string;
  public brightness: number;
  public roomLight: number;
  public driver: DriverType;
  public flux: number;

  constructor(
    action: string,
    brightness: number,
    roomLight: number,
    driver: DriverType,
    flux: number,
  ) {
    this.action = action;
    this.brightness = brightness;
    this.roomLight = roomLight;
    this.driver = driver;
    this.flux = flux;
  }
}

export default SettingsMessage;
