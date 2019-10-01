import { getNameFromToken, isAuthorised } from '../../auth/auth';
import { currentFluxLevel, millisUntilNextFluxChange } from '../../common/flux';
import { settings } from '../../ControllerSettings';
import { CeiledDriver } from '../../hardware/CeiledDriver';
import SolidPattern from '../../patterns/SolidPattern';
import CeiledError from '../common/CeiledError';
import UnauthorisedResponse from '../common/UnauthorisedResponse';
import { IncomingMessage, MessageHandler, OutgoingMessage, StatusType } from '../MessageHandler';
import { SettingsErrorResponse } from './SettingsErrorResponse';
import { SettingsMessage } from './SettingsMessage';
import { SettingsSuccessResponse } from './SettingsSuccessResponse';

/**
 * Handles any messages to set and retrieve settings on the controller.
 */
export class SettingsMessageHandler implements MessageHandler {
  private driver: CeiledDriver;
  private autoFluxTimeout: NodeJS.Timeout;
  constructor(driver: CeiledDriver) {
    this.driver = driver;
  }

  public async handle(message: IncomingMessage): Promise<OutgoingMessage> {
    if (!message.settings) return Promise.resolve(null);
    if (SettingsMessage.isMessage(message.settings)) {
      const req: SettingsMessage = message.settings;
      switch (req.action) {
        case 'get':
          return Promise.resolve(new SettingsSuccessResponse(SettingsMessage.buildGet(settings)));

        case 'set':
          if (!message.authToken || !(await isAuthorised(message.authToken))) {
            return Promise.resolve(new UnauthorisedResponse());
          }
          if (!process.env.TEST) {
            const user = await getNameFromToken(message.authToken);
            console.log(`--> SettingsRequest received from ${user}`);
          }

          const newBrightness = inRange(req.brightness, 0, 100);
          const newRoomlight = inRange(req.roomLight, 0, 100);
          const newFlux = inRange(req.flux, -1, 5);

          // set brightness
          if (settings.brightness !== newBrightness) {
            settings.brightness = newBrightness;
            await this.driver.setBrightness(newBrightness * 2.55);
          }

          // set roomlight
          if (settings.roomLight !== newRoomlight) {
            settings.roomLight = newRoomlight;
            await this.driver.setRoomlight(newRoomlight * 2.55);
          }

          // set flux
          if (settings.flux !== newFlux) {
            if (req.flux === -1) {
              this.autoUpdateFlux();
            } else {
              if (this.autoFluxTimeout) {
                clearTimeout(this.autoFluxTimeout);
                this.autoFluxTimeout = undefined;
              }
              await this.driver.setFlux(inRange(req.flux, 0, 5));
            }
          }

          if (settings.activePattern && settings.activePattern instanceof SolidPattern) {
            await settings.activePattern.show(this.driver);
          }

          return Promise.resolve(new SettingsSuccessResponse());
        default:
          const error: Error = new Error('Invalid action: ' + message.settings.action);
          return Promise.resolve(new SettingsErrorResponse([new CeiledError(error)]));
      }
    }
    return null;
  }

  private autoUpdateFlux() {
    if (this.autoFluxTimeout) {
      clearTimeout(this.autoFluxTimeout);
    }

    this.driver.setFlux(currentFluxLevel(new Date()));
    const millis = millisUntilNextFluxChange(new Date());

    this.autoFluxTimeout = setTimeout(this.autoUpdateFlux, millis);
  }
}

/**
 * Ensures that a certain number value is within a certain range.
 * @param value the value
 * @param min minimum of the range
 * @param max maximum of the range.
 */
const inRange = (value: number, min: number, max: number): number => {
  return value < min ? min : value > max ? max : value;
};

export default SettingsMessageHandler;
