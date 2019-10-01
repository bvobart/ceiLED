import { createConnection, Socket } from 'net';
import Color from '../common/Color';
import { InterpolationType } from '../patterns/options/FadePatternOptions';
import { Driver } from './Driver';

const CMD_OFF = 'set all solid 0 0 0\n';

export class CeiledDriver implements Driver {
  public channels: number;
  public isConnected: boolean = false;

  private socketFileName: string;
  private socket: Socket;
  private shouldReconnect: boolean = true;

  private nextRequestId: number = 0;
  private waitingForResponse: Map<number, (result?: any) => void> = new Map();

  constructor(file: string, channels: number) {
    this.channels = channels;
    this.socketFileName = file;
  }

  public connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.socket = createConnection(this.socketFileName, () => {
        console.log('--> ceiled-driver connected');
        this.isConnected = true;
        this.shouldReconnect = true;

        this.socket.on('data', this.onResponse.bind(this));
        this.socket.on('close', async hadErr => {
          this.isConnected = false;
          console.error('--> ceiled-driver disconnected', hadErr ? 'with error' : '');
          console.log('--> trying to reconnect to ceiled-driver...');

          while (!this.isConnected && this.shouldReconnect) {
            try {
              await this.connect();
            } catch (err) {
              console.error(err);
              console.log('--> trying to reconnect to ceiled-driver after 1 second...');
              await sleep(1000);
            }
          }
        });

        resolve();
      }).on('error', (err: Error) => {
        reject('--> failed to connect to ceiled-driver: ' + err.message + '\n' + err.stack);
      });
    });
  }

  public close(): void {
    if (this.socket) {
      this.shouldReconnect = false;
      this.isConnected = false;
      this.socket.end();
      this.socket = null;
    }
  }

  public off(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.socket || !this.isConnected) return reject('ceiled-driver not connected');
      const id = this.nextRequestId++;
      this.expectResponseOk(id, resolve, reject);
      this.socket.write(`id ${id} ${CMD_OFF}\n`);
    });
  }

  public setColors(colors: Map<number, Color>): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.socket || !this.isConnected) return reject('ceiled-driver not connected');
      if (colors.size === 0) return resolve();

      const id = this.nextRequestId++;
      let cmd = `id ${id} set`;

      for (const channel of colors.keys()) {
        const color = colors.get(channel);
        cmd = cmd + ` ${channel} solid ${color.red} ${color.green} ${color.blue},`;
      }

      this.expectResponseOk(id, resolve, reject);
      this.socket.write(`${cmd}\n`);
    });
  }

  public setFades(
    colors: Map<number, Color>,
    millis: number,
    interpolation: InterpolationType = InterpolationType.LINEAR,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.socket || !this.isConnected) return reject('ceiled-driver not connected');
      if (colors.size === 0) return resolve();

      const id = this.nextRequestId++;
      let cmd = `id ${id} set`;

      for (const channel of colors.keys()) {
        const color = colors.get(channel);
        cmd =
          cmd +
          ` ${channel} fade ${color.red} ${color.green} ${color.blue} ${Math.round(
            millis,
          )} ${interpolation},`;
      }

      this.expectResponseOk(id, resolve, reject);
      this.socket.write(`${cmd}\n`);
    });
  }

  public setBrightness(brightness: number): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.socket || !this.isConnected) return reject('ceiled-driver not connected');
      const id = this.nextRequestId++;
      const cmd = `id ${id} set brightness ${Math.round(brightness)}\n`;
      this.expectResponseOk(id, resolve, reject);
      this.socket.write(cmd);
    });
  }

  public getBrightness(): Promise<number> {
    return this.getNumber('brightness');
  }

  public setRoomlight(roomlight: number): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.socket || !this.isConnected) return reject('ceiled-driver not connected');
      const id = this.nextRequestId++;
      const cmd = `id ${id} set roomlight ${Math.round(roomlight)}\n`;
      this.expectResponseOk(id, resolve, reject);
      this.socket.write(cmd);
    });
  }

  public getRoomlight(): Promise<number> {
    return this.getNumber('roomlight');
  }

  public setFlux(flux: number): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.socket || !this.isConnected) return reject('ceiled-driver not connected');
      const id = this.nextRequestId++;
      const cmd = `id ${id} set flux ${Math.round(flux)}\n`;
      this.expectResponseOk(id, resolve, reject);
      this.socket.write(cmd);
    });
  }

  public getFlux(): Promise<number> {
    return this.getNumber('flux');
  }

  private getNumber(name: string): Promise<number> {
    return new Promise(async (resolve, reject) => {
      if (!this.socket || !this.isConnected) return reject('ceiled-driver not connected');
      const id = this.nextRequestId++;
      const cmd = `id ${id} get ${name}\n`;
      const promise = this.expectReply(id);
      this.socket.write(cmd);
      const reply = await promise;

      try {
        const res = parseInt(reply, 10);
        resolve(res);
      } catch (error) {
        reject(error);
      }
    });
  }

  private expectResponseOk(
    id: number,
    resolve: (result?: any) => void,
    reject: (error?: any) => void,
  ): void {
    this.waitingForResponse.set(id, res => {
      if (res === 'ok') resolve();
      else reject(res);
    });
  }

  private expectReply(id: number): Promise<string> {
    return new Promise((resolve, reject) => {
      this.waitingForResponse.set(id, resolve);
    });
  }

  private onResponse(buf: Buffer) {
    const data = buf.toString().trim();
    const ids = data.match(/id \d*/);

    if (ids && ids.length > 0) {
      const id = parseInt(ids[0].substring(2), 10);
      const resolveFunc = this.waitingForResponse.get(id);

      if (resolveFunc) {
        this.waitingForResponse.delete(id);
        const trimmedData = data.replace(ids[0], '').trim();
        resolveFunc(trimmedData);
      } else {
        console.log('--> driver sent an unsollicited response:', data);
      }
    } else {
      console.log('--> driver returned an error:', data);
    }
  }
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
