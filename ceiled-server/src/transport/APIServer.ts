import { readFileSync } from 'fs';
import { createServer } from 'https';
import * as SocketIO from 'socket.io';
import AuthRepository from '../auth/AuthRepository';
import { decodeAnimationMap } from '../patterns/Animation';
import { decodePattern, decodePatternMap } from '../patterns/Pattern';
import { Service } from '../service/Service';
import {
  GetPatternRequest,
  OffRequest,
  SetAnimationsRequest,
  SetMoodRequest,
  SetPatternRequest,
  SetPatternsRequest,
} from './messages/ceiled-requests';
import { AnimationsResponse, PatternResponse, PatternsResponse } from './messages/ceiled-responses';
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
  SPEED = 'speed',
}

export class APIServer {
  private server: SocketIO.Server | null;
  private service: Service;
  private auth: AuthRepository;

  /**
   * Creates an APIServer object with the given service layer.
   * @param service the service layer
   */
  constructor(service: Service, authRepo: AuthRepository) {
    this.server = null;
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
  listen(port: number, keyFile?: string, certFile?: string): void {
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
  async close(): Promise<void> {
    return new Promise(resolve => {
      if (!this.server) return resolve();

      this.server.emit(Events.SERVER, 'closing');
      this.server.close(() => resolve());
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
  public handleConnect(socket: SocketIO.Socket): void {
    console.log('-> Client connected.');

    socket.on(Events.DISCONNECT, this.handleDisconnect.bind(this));

    socket.on(Events.BRIGHTNESS, (m: any) => {
      void this.authorised(handleError(this.handleBrightness.bind(this)))(Events.BRIGHTNESS, socket, m) // eslint-disable-line prettier/prettier
    });
    socket.on(Events.ROOMLIGHT, (m: any) => {
      void this.authorised(handleError(this.handleRoomlight.bind(this)))(Events.ROOMLIGHT, socket, m) // eslint-disable-line prettier/prettier
    });
    socket.on(Events.FLUX, (m: any) => {
      void this.authorised(handleError(this.handleFlux.bind(this)))(Events.FLUX, socket, m) // eslint-disable-line prettier/prettier
    });
    socket.on(Events.CEILED, (m: any) => {
      void this.authorised(handleError(this.handleCeiled.bind(this)))(Events.CEILED, socket, m) // eslint-disable-line prettier/prettier
    });
    socket.on(Events.SPEED, (m: any) => {
      void this.authorised(handleError(this.handleSpeed.bind(this)))(Events.SPEED, socket, m) // eslint-disable-line prettier/prettier
    });
  }

  /**
   * Handles a disconnected socket.
   * @param socket the newly connected socket
   */
  public handleDisconnect(): void {
    console.log('-> Client disconnected.');
  }

  /**
   * Handles an incoming message on `Events.BRIGHTNESS`.
   * @param socket the active socket that the message was sent through
   * @param message the incoming message
   */
  public async handleBrightness(socket: SocketIO.Socket, message: unknown): Promise<void> {
    if (GetSettingRequest.is(message)) {
      const brightness = await this.service.getBrightness();
      socket.emit(Events.BRIGHTNESS, brightness);
    } else if (SetSettingRequest.is<number>(message, 'number')) {
      await this.service.setBrightness(message.value);
      socket.broadcast.emit(Events.BRIGHTNESS, message.value);
    } else {
      socket.emit(Events.ERRORS, new InvalidRequestMessage(Events.BRIGHTNESS, message));
    }
  }

  /**
   * Handles an incoming message on `Events.ROOMLIGHT`.
   * @param socket the active socket that the message was sent through
   * @param message the incoming message
   */
  public async handleRoomlight(socket: SocketIO.Socket, message: unknown): Promise<void> {
    if (GetSettingRequest.is(message)) {
      const roomlight = await this.service.getRoomlight();
      socket.emit(Events.ROOMLIGHT, roomlight);
    } else if (SetSettingRequest.is<number>(message, 'number')) {
      await this.service.setRoomlight(message.value);
      socket.broadcast.emit(Events.ROOMLIGHT, message.value);
    } else {
      socket.emit(Events.ERRORS, new InvalidRequestMessage(Events.ROOMLIGHT, message));
    }
  }

  /**
   * Handles an incoming message on `Events.FLUX`.
   * @param socket the active socket that the message was sent through
   * @param message the incoming message
   */
  public async handleFlux(socket: SocketIO.Socket, message: unknown): Promise<void> {
    if (GetSettingRequest.is(message)) {
      const flux = await this.service.getFlux();
      socket.emit(Events.FLUX, flux);
    } else if (SetSettingRequest.is<number>(message, 'number')) {
      await this.service.setFlux(message.value);
      socket.broadcast.emit(Events.FLUX, message.value);
    } else {
      socket.emit(Events.ERRORS, new InvalidRequestMessage(Events.FLUX, message));
    }
  }

  /**
   * Handles an incoming message on `Events.SPEED`.
   * Speed should be handled with care, it can be strong stuff :P
   * @param socket the active socket that the message was sent through
   * @param message the incoming message
   */
  public async handleSpeed(socket: SocketIO.Socket, message: unknown): Promise<void> {
    if (GetSettingRequest.is(message)) {
      const speed = await this.service.getSpeed();
      socket.emit(Events.SPEED, speed);
    } else if (SetSettingRequest.is<number>(message, 'number')) {
      await this.service.setSpeed(message.value);
      socket.broadcast.emit(Events.SPEED, message.value);
    } else {
      socket.emit(Events.SPEED, new InvalidRequestMessage(Events.SPEED, message));
    }
  }

  /**
   * Handles an incoming message on `Events.CEILED`.
   * A switch case might be useful here, but then we lose TypeScript's automatic type-casting.
   * @param socket the active socket that the message was sent through
   * @param message the incoming message
   */
  public async handleCeiled(socket: SocketIO.Socket, message: unknown): Promise<void> {
    // get pattern(s)
    if (GetPatternRequest.is(message)) {
      // get all
      if (message.channel === 'all') {
        const patterns = await this.service.getPatterns();
        const res: PatternsResponse = { patterns: Array.from(patterns.entries()) };
        socket.emit(Events.CEILED, res);
        // get one
      } else {
        const pattern = await this.service.getPattern(message.channel);
        const res: PatternResponse = { channel: message.channel, pattern };
        socket.emit(Events.CEILED, res);
      }

      // turn off
    } else if (OffRequest.is(message)) {
      await this.service.off();

      // set pattern
    } else if (SetPatternRequest.is(message)) {
      const pattern = decodePattern(message.pattern);
      await this.service.setPattern(message.channel, pattern);
      if (message.channel === 'all') {
        const patterns = await this.service.getPatterns();
        const res: PatternsResponse = { patterns: Array.from(patterns.entries()) };
        socket.broadcast.emit(Events.CEILED, res);
      } else {
        const res: PatternResponse = { channel: message.channel, pattern };
        socket.broadcast.emit(Events.CEILED, res);
      }

      // set patterns
    } else if (SetPatternsRequest.is(message)) {
      const patterns = decodePatternMap(new Map(message.patterns));
      await this.service.setPatterns(patterns);
      const res: PatternsResponse = { patterns: message.patterns };
      socket.broadcast.emit(Events.CEILED, res);

      // set animations
    } else if (SetAnimationsRequest.is(message)) {
      const animations = decodeAnimationMap(new Map(message.animations));
      await this.service.setAnimations(animations);
      const res: AnimationsResponse = { animations: message.animations };
      socket.broadcast.emit(Events.CEILED, res);

      // set mood
    } else if (SetMoodRequest.is(message)) {
      // TODO: perhaps broadcast that a new mood was set?
      await this.service.setMood(message.mood);

      // invalid request
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
      const err = error as Error;
      console.error('!---------------------------!');
      console.error('--> An internal error occurred on', event, ':', err);
      console.error('!---------------------------!');
      socket.emit(Events.ERRORS, new InternalErrorMessage(event, message, err));
    }
  };
};
