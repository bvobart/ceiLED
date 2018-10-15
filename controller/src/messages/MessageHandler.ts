import * as WebSocket from 'ws';
import Pattern from '../patterns/Pattern';
import { CeiledRequest } from './CeiledRequest';
import { CeiledResponse, CeiledResponseType } from './CeiledResponse';

/**
 * A MessageHandler is created with an opened websocket and contains a `handle` method that is
 * able to handle the messages that come in through the web socket. These messages have the form
 * as described in the API documentation.
 * 
 * MessageHandler mainly functions as an interface to the websocket: listening for messages and
 * sending responses in return. The translation of a Request to a Pattern is delegated to the 
 * CeiledRequest class.
 */
class MessageHandler {
  private websocket: WebSocket;
  private activePattern: Pattern;

  constructor(socket: WebSocket) {
    this.websocket = socket;
    this.handle = this.handle.bind(this);
    this.websocket.on('message', this.handle);
  }

  /**
   * Handles a message coming in through the web socket. See the API documentation for more
   * details about the messages it handles.
   * @param payload The payload of the message.
   */
  public handle(payload: string): void {
    try {
      const message: any = JSON.parse(payload);
      if (message.data && CeiledRequest.isRequest(message.data)) {
        const request: CeiledRequest = new CeiledRequest(
          message.data.type,
          message.data.brightness,
          message.data.roomLight,
          message.data.colors,
          message.data.patternOptions
        );
        const pattern: Pattern = request.toPattern();

        if (this.activePattern) this.activePattern.stop();

        this.activePattern = pattern;
        this.activePattern.show();
        this.sendSuccess();
      } else {
        const error: Error = new Error('Message is invalid: ' + JSON.stringify(message));
        console.error('Error with request:', error);
        this.sendFail([error]);
      }
    } catch (error) {
      console.error('Internal error:', error);
      this.sendError([error]);
    }
  }

  /**
   * Sends an error response over the web socket, including the given errors.
   * An error response means that some internal error occurred while processing the request.
   * @param errors Errors that occurred
   */
  public sendError(errors: Error[]): void {
    const response: CeiledResponse = new CeiledResponse(CeiledResponseType.ERROR, errors);
    this.websocket.emit(JSON.stringify(response));
  }

  /**
   * Sends a fail response over the web socket, including the given errors.
   * A fail response means that the request was malformed.
   * @param errors Errors that occurred
   */
  public sendFail(errors: Error[]): void {
    const response: CeiledResponse = new CeiledResponse(CeiledResponseType.FAIL, errors);
    this.websocket.emit(JSON.stringify(response));
  }

  /**
   * Sends a success response over the web socket.
   */
  public sendSuccess(): void {
    const response: CeiledResponse = new CeiledResponse(CeiledResponseType.SUCCES);
    this.websocket.emit(JSON.stringify(response));
  }
}

export default MessageHandler;