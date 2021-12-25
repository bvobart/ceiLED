import { createConnection, Socket } from 'net';
import Color from '../common/Color';
import { Driver } from './Driver';
import { InterpolationType } from './interpolate';

const CMD_OFF = 'set roomlight 0\nset all solid 0 0 0';

export class CeiledDriver implements Driver {
  channels: number;
  isConnected = false;

  private socketFileName: string;
  private socket: Socket | null;
  private shouldReconnect = true;

  private nextRequestId = 0;
  private waitingForResponse = new Map<number, (result?: any) => void>();

  constructor(file: string, channels: number) {
    this.channels = channels;
    this.socketFileName = file;
    this.socket = null;
  }

  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.socket = createConnection(this.socketFileName, () => {
        console.log('--> ceiled-driver connected');
        this.isConnected = true;
        this.shouldReconnect = true;

        this.socket?.on('data', this.onResponse.bind(this));
        this.socket?.on('close', (hadErr: boolean) => {
          this.onClose(hadErr).catch(err =>
            console.error('failed to close connection to driver:', err),
          );
        });

        resolve();
      }).on('error', (err: Error) => {
        reject(`--> failed to connect to ceiled-driver:\n${err.stack || ''}`);
      });
    });
  }

  close(): void {
    if (this.socket) {
      this.shouldReconnect = false;
      this.isConnected = false;
      this.socket.end();
      this.socket = null;
    }
  }

  async off(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.socket || !this.isConnected) return reject('ceiled-driver not connected');
      const id = this.nextRequestId++;
      this.socket.write(`id ${id} ${CMD_OFF}\n`);
      resolve();
    });
  }

  async setColors(colors: Map<number, Color>): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.socket || !this.isConnected) return reject('ceiled-driver not connected');
      if (colors.size === 0) return resolve();

      const id = this.nextRequestId++;
      let cmd = `id ${id} set`;

      for (const [channel, color] of colors.entries()) {
        cmd = cmd + ` ${channel} solid ${color.red} ${color.green} ${color.blue},`;
      }

      this.socket.write(`${cmd}\n`);
      resolve();
    });
  }

  async setFades(
    colors: Map<number, Color>,
    millis: number,
    interpolation: InterpolationType = InterpolationType.LINEAR,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.socket || !this.isConnected) return reject('ceiled-driver not connected');
      if (colors.size === 0) return resolve();

      const id = this.nextRequestId++;
      let cmd = `id ${id} set`;

      for (const [channel, color] of colors.entries()) {
        cmd =
          cmd +
          ` ${channel} fade ${color.red} ${color.green} ${color.blue} ${Math.round(
            millis,
          )} ${interpolation},`;
      }

      this.socket.write(`${cmd}\n`);
      resolve();
    });
  }

  async setBrightness(brightness: number): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.socket || !this.isConnected) return reject('ceiled-driver not connected');
      const id = this.nextRequestId++;
      const cmd = `id ${id} set brightness ${Math.round(brightness)}\n`;
      this.socket.write(cmd);
      resolve();
    });
  }

  async getBrightness(): Promise<number> {
    return this.getNumber('brightness');
  }

  async setRoomlight(roomlight: number): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.socket || !this.isConnected) return reject('ceiled-driver not connected');
      const id = this.nextRequestId++;
      const cmd = `id ${id} set roomlight ${Math.round(roomlight)}\n`;
      this.socket.write(cmd);
      resolve();
    });
  }

  async getRoomlight(): Promise<number> {
    return this.getNumber('roomlight');
  }

  async setFlux(flux: number): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.socket || !this.isConnected) return reject('ceiled-driver not connected');
      const id = this.nextRequestId++;
      const cmd = `id ${id} set flux ${Math.round(flux)}\n`;
      this.socket.write(cmd);
      resolve();
    });
  }

  async getFlux(): Promise<number> {
    return this.getNumber('flux');
  }

  private async getNumber(name: string): Promise<number> {
    if (!this.socket || !this.isConnected) throw new Error('ceiled-driver not connected');

    const id = this.nextRequestId++;
    const cmd = `id ${id} get ${name}\n`;
    const promise = this.expectReply(id);
    this.socket.write(cmd);

    const reply = await promise;
    return parseInt(reply, 10);
  }

  private async expectReply(id: number): Promise<string> {
    return new Promise(resolve => {
      this.waitingForResponse.set(id, resolve);
    });
  }

  private async onClose(hadErr: boolean) {
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
  }

  private onResponse(buf: Buffer) {
    const data = buf.toString().trim();
    const ids = /^id \d*/.exec(data);

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

const sleep = async (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
