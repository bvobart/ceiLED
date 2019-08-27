import { getNameFromToken, isAuthorised } from '../../auth/auth';
import { settings } from '../../ControllerSettings';
import { CeiledDriver } from '../../hardware/CeiledDriver';
import Pattern from '../../patterns/Pattern';
import UnauthorisedResponse from '../common/UnauthorisedResponse';
import { IncomingMessage, MessageHandler, OutgoingMessage, StatusType } from '../MessageHandler';
import { CeiledRequest } from './CeiledRequest';
import { CeiledResponse } from './CeiledResponse';

/**
 * A MessageHandler contains a `handle` method that is able to handle the messages that come in through
 * the web socket. These messages have the form as described in the API documentation.
 *
 * MessageHandler mainly functions as an interface to the websocket: listening for messages and
 * sending responses in return. The translation of a Request to a Pattern is delegated to the
 * CeiledRequest class.
 */
class CeiledMessageHandler implements MessageHandler {
  private driver: CeiledDriver;

  constructor(driver: CeiledDriver) {
    this.driver = driver;
    this.handle = this.handle.bind(this);
  }

  /**
   * Handles a message coming in through the web socket. See the API documentation for more
   * details about the messages it handles.
   * @param payload The payload of the message.
   */
  public async handle(message: IncomingMessage): Promise<OutgoingMessage> {
    if (!message.data) return null;

    if (CeiledRequest.isRequest(message.data)) {
      if (!message.authToken || !(await isAuthorised(message.authToken))) {
        return Promise.resolve(new UnauthorisedResponse());
      }
      if (!process.env.TEST)
        console.log('--> CeiledRequest received from ', await getNameFromToken(message.authToken));

      const request: CeiledRequest = new CeiledRequest(
        message.data.type,
        message.data.colors,
        message.data.patternOptions,
      );
      const pattern: Pattern = request.toPattern();

      if (settings && settings.activePattern) settings.activePattern.stop();

      settings.activePattern = pattern;
      settings.activePattern.show(this.driver);
      return Promise.resolve(new CeiledResponse(StatusType.SUCCES));
    } else {
      const error: Error = new Error('Message is invalid: ' + JSON.stringify(message));
      console.error('--> Message is invalid: ', message);
      return Promise.resolve(new CeiledResponse(StatusType.FAIL, [error]));
    }
  }
}

export default CeiledMessageHandler;
