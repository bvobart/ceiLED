import { readFileSync } from 'fs';
import { createServer } from 'https';
import * as SocketIO from 'socket.io';

import AuthRepository from '../auth/AuthRepository';
import { Service } from '../service/Service';
import { InvalidRequestMessage, UnauthorisedMessage } from './messages/errors';

export enum Events {
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  SERVER = 'server',
  ERROR = 'error',
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

    this.server.on(Events.CONNECT, this.handleConnect);
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

  public async authorised(
    socket: SocketIO.Socket,
    message: any,
    handler: (socket: SocketIO.Socket, message: any) => Promise<void>,
  ): Promise<void> {
    if (!AuthorisedRequest.is(message)) {
      socket.emit(Events.ERROR, new UnauthorisedMessage());
      return;
    }

    const auth = await this.auth.findByToken(message.authToken);
    if (!auth) {
      socket.emit(Events.ERROR, new UnauthorisedMessage());
      return;
    }

    return handler(socket, message);
  }

  /**
   * Handles a newly established socket connection.
   * @param socket the newly connected socket
   */
  public handleConnect(socket: SocketIO.Socket) {
    console.log('--> Client connected.');

    socket.on(Events.DISCONNECT, this.handleDisconnect);
    socket.on(Events.BRIGHTNESS, (m: any) => this.authorised(socket, m, this.handleBrightness));
    socket.on(Events.ROOMLIGHT, (m: any) => this.authorised(socket, m, this.handleRoomlight));
    socket.on(Events.FLUX, (m: any) => this.authorised(socket, m, this.handleFlux));
    // TODO: add handler for CeiLED messages.
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
      socket.emit(Events.ERROR, new InvalidRequestMessage(Events.BRIGHTNESS, message));
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
      socket.emit(Events.ERROR, new InvalidRequestMessage(Events.ROOMLIGHT, message));
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
      socket.emit(Events.ERROR, new InvalidRequestMessage(Events.FLUX, message));
    }
  }
}
