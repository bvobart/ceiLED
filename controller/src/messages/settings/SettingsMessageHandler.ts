import { getNameFromToken, isAuthorised } from '../../auth/auth';
import { settings } from '../../server';
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
          if (!process.env.TEST)
            console.log(
              'SettingsRequest received from ',
              (await getNameFromToken(message.authToken)) + '\n',
            );

          settings.brightness = inRange(req.brightness, 0, 100);
          settings.roomLight = inRange(req.roomLight, 0, 100);
          settings.flux = inRange(req.flux, -1, 5);
          if (req.driver) settings.setDriver(req.driver);

          // TODO: call show() again on currently active pattern.
          // TODO: move activePattern from CeiledMessageHandler to ControllerSettings

          return Promise.resolve(new SettingsSuccessResponse());
        default:
          const error: Error = new Error('Invalid action: ' + message.settings.action);
          return Promise.resolve(new SettingsErrorResponse([new CeiledError(error)]));
      }
    }
    return null;
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
