import { readFileSync } from 'fs';
import { createServer } from 'https';
import * as SocketIO from 'socket.io';
import { Service } from '../service/Service';

enum Events {
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

  public handleConnect(socket: SocketIO.Socket) {
    console.log('--> Client connected.');

    socket.on(Events.DISCONNECT, this.handleDisconnect);
    socket.on(Events.BRIGHTNESS, this.handleBrightness);
    socket.on(Events.ROOMLIGHT, this.handleRoomlight);
    socket.on(Events.FLUX, this.handleRoomlight);
    // TODO: add handler for CeiLED messages.
  }

  public handleDisconnect(): void {
    console.log('--> Client disconnected.');
  }

  public handleBrightness(message: any): void {
    if (GetSettingRequest.is(message)) {
      this.service.getBrightness();
    } else if (SetSettingRequest.is<number>(message, 'number')) {
      this.service.setBrightness(message.value);
    } else {
      // TODO: emit error message
    }
  }

  public handleRoomlight(message: any): void {
    if (GetSettingRequest.is(message)) {
      this.service.getRoomlight();
    } else if (SetSettingRequest.is<number>(message, 'number')) {
      this.service.setRoomlight(message.value);
    } else {
      // TODO: emit error message
    }
  }

  public handleFlux(message: any): void {
    if (GetSettingRequest.is(message)) {
      this.service.getFlux();
    } else if (SetSettingRequest.is<number>(message, 'number')) {
      this.service.setFlux(message.value);
    } else {
      // TODO: emit error message
    }
  }
}
