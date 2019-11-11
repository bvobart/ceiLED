import { readFileSync } from 'fs';
import { createServer } from 'https';
import * as SocketIO from 'socket.io';

import AuthRepository from '../auth/AuthRepository';
import { Service } from '../service/Service';
import {
  GetPatternRequest,
  OffRequest,
  SetMultiplePatternsRequest,
  SetPatternRequest,
} from './messages/ceiled';
import { AuthorisedRequest, GetSettingRequest, SetSettingRequest } from './messages/common';
import {
  InternalErrorMessage,
  InvalidRequestMessage,
  UnauthorisedMessage,
} from './messages/errors';

export enum Events {
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  SERVER = 'server',
  ERRORS = 'errors',
  BRIGHTNESS = 'brightness',
  ROOMLIGHT = 'roomlight',
  FLUX = 'flux',
  CEILED = 'ceiled',
}

export class APIServer {
  private server: SocketIO.Server;
  private service: Service;
  private auth: AuthRepository;

  /**
   * Creates an APIServer object with the given service layer.
   * @param service the service layer
   */
  constructor(service: Service, authRepo: AuthRepository) {
    this.service = service;
    this.auth = authRepo;
  }

  /**
   * Starts a Socket.io server on the given port. If `keyFile` and `certFile` are provided, then
   * this will be hosted over HTTPS, using the SSL key and certificate at the given file locations.
   * Otherwise, the server will be hosted over HTTP.
   *
   * @param port port to listen on
   * @param keyFile path to SSL private key file
   * @param certFile path to SSL public certificate file
   */
  public listen(port: number, keyFile?: string, certFile?: string) {
    if (keyFile && certFile) {
      const httpsServer = createServer({
        key: readFileSync(keyFile),
        cert: readFileSync(certFile),
      });
      httpsServer.listen(port);
      this.server = SocketIO(httpsServer);
    } else {
      this.server = SocketIO(port);
    }

    this.server.on(Events.CONNECT, this.handleConnect.bind(this));
  }

  /**
   * Closes the server
   */
  public close(): Promise<void> {
    return new Promise(resolve => {
      if (!this.server) return resolve();

      this.server.emit(Events.SERVER, 'closing');
      this.server.close(resolve);
    });
  }

  /**
   * Ensures that a request message coming in on the specified event is authorised
   * before calling the handler.
   * @param event the event the messages was received on
   * @param socket the socket connection the message was received from
   * @param message the message that was received
   * @param handler the handler function that should handle messages for that event.
   */
  public authorised(
    handler: (event: Events, socket: SocketIO.Socket, message: any) => Promise<void>,
  ): (event: Events, socket: SocketIO.Socket, message: any) => Promise<void> {
    return async (event: Events, socket: SocketIO.Socket, message: any): Promise<void> => {
      if (!AuthorisedRequest.is(message)) {
        socket.emit(Events.ERRORS, new UnauthorisedMessage());
        return;
      }

      const auth = await this.auth.findByToken(message.authToken);
      if (!auth) {
        socket.emit(Events.ERRORS, new UnauthorisedMessage());
        return;
      }

      console.log(`--> Received new message on '${event}' from ${auth.name}`);
      return handler(event, socket, message);
    };
  }

  /**
   * Handles a newly established socket connection.
   * @param socket the newly connected socket
   */
  public handleConnect(socket: SocketIO.Socket) {
    console.log('--> Client connected.');

    socket.on(Events.DISCONNECT, this.handleDisconnect.bind(this));

    socket.on(Events.BRIGHTNESS, (m: any) =>
      this.authorised(handleError(this.handleBrightness.bind(this)))(Events.BRIGHTNESS, socket, m),
    );
    socket.on(Events.ROOMLIGHT, (m: any) =>
      this.authorised(handleError(this.handleRoomlight.bind(this)))(Events.ROOMLIGHT, socket, m),
    );
    socket.on(Events.FLUX, (m: any) =>
      this.authorised(handleError(this.handleFlux.bind(this)))(Events.FLUX, socket, m),
    );
    socket.on(Events.CEILED, (m: any) =>
      this.authorised(handleError(this.handleCeiled.bind(this)))(Events.CEILED, socket, m),
    );
  }

  /**
   * Handles a disconnected socket.
   * @param socket the newly connected socket
   */
  public handleDisconnect(): void {
    console.log('--> Client disconnected.');
  }

  /**
   * Handles an incoming message on `Events.BRIGHTNESS`.
   * @param socket the active socket that the message was sent through
   * @param message the incoming message
   */
  public async handleBrightness(socket: SocketIO.Socket, message: any): Promise<void> {
    if (GetSettingRequest.is(message)) {
      const brightness = await this.service.getBrightness();
      socket.emit(Events.BRIGHTNESS, brightness);
    } else if (SetSettingRequest.is<number>(message, 'number')) {
      await this.service.setBrightness(message.value);
    } else {
      socket.emit(Events.ERRORS, new InvalidRequestMessage(Events.BRIGHTNESS, message));
    }
  }

  /**
   * Handles an incoming message on `Events.ROOMLIGHT`.
   * @param socket the active socket that the message was sent through
   * @param message the incoming message
   */
  public async handleRoomlight(socket: SocketIO.Socket, message: any): Promise<void> {
    if (GetSettingRequest.is(message)) {
      const roomlight = await this.service.getRoomlight();
      socket.emit(Events.ROOMLIGHT, roomlight);
    } else if (SetSettingRequest.is<number>(message, 'number')) {
      await this.service.setRoomlight(message.value);
    } else {
      socket.emit(Events.ERRORS, new InvalidRequestMessage(Events.ROOMLIGHT, message));
    }
  }

  /**
   * Handles an incoming message on `Events.FLUX`.
   * @param socket the active socket that the message was sent through
   * @param message the incoming message
   */
  public async handleFlux(socket: SocketIO.Socket, message: any): Promise<void> {
    if (GetSettingRequest.is(message)) {
      const flux = await this.service.getFlux();
      socket.emit(Events.FLUX, flux);
    } else if (SetSettingRequest.is<number>(message, 'number')) {
      await this.service.setFlux(message.value);
    } else {
      socket.emit(Events.ERRORS, new InvalidRequestMessage(Events.FLUX, message));
    }
  }

  public async handleCeiled(socket: SocketIO.Socket, message: any): Promise<void> {
    if (GetPatternRequest.is(message)) {
      const pattern = await this.service.getPattern(message.channel);
      socket.emit(Events.CEILED, pattern);
    } else if (OffRequest.is(message)) {
      await this.service.off();
    } else if (SetPatternRequest.is(message)) {
      await this.service.setPattern(message.channel, message.pattern);
    } else if (SetMultiplePatternsRequest.is(message)) {
      await this.service.setMultiplePatterns(message.patterns);
    } else {
      socket.emit(Events.ERRORS, new InvalidRequestMessage(Events.CEILED, message));
    }
  }
}

const handleError = (
  handler: (socket: SocketIO.Socket, message: any) => Promise<void>,
): ((event: Events, socket: SocketIO.Socket, message: any) => Promise<void>) => {
  return async (event: Events, socket: SocketIO.Socket, message: any): Promise<void> => {
    try {
      await handler(socket, message);
    } catch (error) {
      console.error('!---------------------------!');
      console.error('--> An internal error occurred on', event, ':', error);
      console.error('!---------------------------!');
      socket.emit(Events.ERRORS, new InternalErrorMessage(event, message, error));
    }
  };
};
