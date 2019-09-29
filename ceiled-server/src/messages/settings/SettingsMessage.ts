import { ControllerSettings } from '../../ControllerSettings';

export class SettingsMessage {
  public static buildGet(settings: ControllerSettings): SettingsMessage {
    return new SettingsMessage('get', settings.brightness, settings.roomLight, settings.flux);
  }

  public static isMessage(x: any): x is SettingsMessage {
    return (
      typeof x.action === 'string' &&
      (!x.brightness || typeof x.brightness === 'number') &&
      (!x.roomLight || typeof x.roomLight === 'number') &&
      (!x.flux || typeof x.flux === 'number')
    );
  }

  public action: string;
  public brightness: number;
  public roomLight: number;
  public flux: number;

  constructor(action: string, brightness: number, roomLight: number, flux: number) {
    this.action = action;
    this.brightness = brightness;
    this.roomLight = roomLight;
    this.flux = flux;
  }
}

export default SettingsMessage;
