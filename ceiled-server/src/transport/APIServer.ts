import { readFileSync } from 'fs';
import { createServer } from 'https';
import * as SocketIO from 'socket.io';
import { Service } from '../service/Service';
import { InvalidRequestMessage } from './messages/errors';

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

  /**
   * Creates an APIServer object with the given service layer.
   * @param service the service layer
   */
  constructor(service: Service) {
    this.service = service;
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

  /**
   * Handles a newly established socket connection.
   * @param socket the newly connected socket
   */
  public handleConnect(socket: SocketIO.Socket) {
    console.log('--> Client connected.');

    socket.on(Events.DISCONNECT, this.handleDisconnect);
    socket.on(Events.BRIGHTNESS, (m: any) => this.handleBrightness(socket, m));
    socket.on(Events.ROOMLIGHT, (m: any) => this.handleRoomlight(socket, m));
    socket.on(Events.FLUX, (m: any) => this.handleFlux(socket, m));
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
  public handleBrightness(socket: SocketIO.Socket, message: any): void {
    if (GetSettingRequest.is(message)) {
      this.service.getBrightness();
    } else if (SetSettingRequest.is<number>(message, 'number')) {
      this.service.setBrightness(message.value);
    } else {
      socket.emit(Events.ERROR, new InvalidRequestMessage(Events.BRIGHTNESS, message));
    }
  }

  /**
   * Handles an incoming message on `Events.ROOMLIGHT`.
   * @param socket the active socket that the message was sent through
   * @param message the incoming message
   */
  public handleRoomlight(socket: SocketIO.Socket, message: any): void {
    if (GetSettingRequest.is(message)) {
      this.service.getRoomlight();
    } else if (SetSettingRequest.is<number>(message, 'number')) {
      this.service.setRoomlight(message.value);
    } else {
      socket.emit(Events.ERROR, new InvalidRequestMessage(Events.ROOMLIGHT, message));
    }
  }

  /**
   * Handles an incoming message on `Events.FLUX`.
   * @param socket the active socket that the message was sent through
   * @param message the incoming message
   */
  public handleFlux(socket: SocketIO.Socket, message: any): void {
    if (GetSettingRequest.is(message)) {
      this.service.getFlux();
    } else if (SetSettingRequest.is<number>(message, 'number')) {
      this.service.setFlux(message.value);
    } else {
      socket.emit(Events.ERROR, new InvalidRequestMessage(Events.FLUX, message));
    }
  }
}
