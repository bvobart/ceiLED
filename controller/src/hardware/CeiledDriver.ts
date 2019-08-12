import { createConnection, Socket } from 'net';
import Color from '../common/Color';
import { InterpolationType } from '../patterns/options/FadePatternOptions';
import { Driver } from './Driver';

const CMD_OFF = 'set all solid 0 0 0\n';
const CMD_GET = 'get\n';

export class CeiledDriver implements Driver {
  public channels: number;
  public isConnected: boolean;

  private socketFileName: string;
  private socket: Socket;
  private shouldReconnect: boolean = true;

  constructor(file: string, channels: number) {
    this.channels = channels;
    this.isConnected = false;
    this.socketFileName = file;
  }

  public connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.socket = createConnection(this.socketFileName, () => {
        console.log('--> ceiled-driver connected');
        this.isConnected = true;
        this.shouldReconnect = true;

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
      this.socket.write(CMD_OFF);
      resolve();
    });
  }

  public getColor(): Promise<Color> {
    return new Promise((resolve, reject) => {
      if (!this.socket) return reject('ceiled-driver not connected');
      // TODO: this technically only gets the last set color, without care for which channel it was set on
      // TODO: needs better implementation in Rust ceiled-driver.
      this.socket.once('data', (data: Buffer) => {
        const res = data.toString();
        if (res.trim() === 'none') resolve(Color.BLACK);

        const rgbStr = res.match(/\d{1,3} \d{1,3} \d{1,3}/g);
        if (rgbStr) {
          const rgb = rgbStr[0].split(' ');
          resolve(
            new Color({
              red: parseInt(rgb[0], 10),
              green: parseInt(rgb[1], 10),
              blue: parseInt(rgb[2], 10),
            }),
          );
        } else {
          reject('invalid format in response from ceiled-driver: ' + res);
        }
      });
      this.socket.write(CMD_GET);
    });
  }

  public setColor(channels: number[], color: Color): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.socket || !this.isConnected) return reject('ceiled-driver not connected');
      const chStr = buildChannelString(channels);
      this.expectResponseOk(resolve, reject);
      this.socket.write(`set ${chStr} solid ${color.red} ${color.green} ${color.blue}\n`);
    });
  }

  public setColors(colors: Map<number, Color>): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.socket || !this.isConnected) return reject('ceiled-driver not connected');
      if (colors.size === 0) return resolve();

      const channels = colors.keys();
      const firstChannel = channels.next().value;
      const firstColor = colors.get(firstChannel);
      let cmd = `set ${firstChannel} solid ${firstColor.red} ${firstColor.green} ${
        firstColor.blue
      }`;

      for (const channel of channels) {
        const color = colors.get(channel);
        cmd = cmd + ` , ${channel} ${color.red} ${color.green} ${color.blue}`;
      }

      this.expectResponseOk(resolve, reject);
      this.socket.write(`${cmd}\n`);
    });
  }

  public setFade(
    channels: number[],
    to: Color,
    millis: number,
    interpolation: InterpolationType = InterpolationType.LINEAR,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.socket || !this.isConnected) return reject('ceiled-driver not connected');
      const chStr = buildChannelString(channels);
      const interpStr = interpolation === InterpolationType.SIGMOID ? 'sigmoid' : 'linear';
      this.expectResponseOk(resolve, reject);
      this.socket.write(
        `set ${chStr} fade ${to.red} ${to.green} ${to.blue} ${millis} ${interpStr}\n`,
      );
    });
  }

  public setFades(
    colors: Map<number, Color>,
    millis: number,
    interpolation: InterpolationType = InterpolationType.LINEAR,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.socket || !this.isConnected) return reject('ceiled-driver not connected');
      const channels = colors.keys();
      const firstChannel = channels.next().value;
      const firstColor = colors.get(firstChannel);
      let cmd = `set ${firstChannel} fade ${firstColor.red} ${firstColor.green} ${firstColor.blue}`;

      for (const channel of channels) {
        const color = colors.get(channel);
        cmd = cmd + ` , ${channel} ${color.red} ${color.green} ${color.blue}`;
      }

      this.expectResponseOk(resolve, reject);
      this.socket.write(`${cmd} ${millis} ${interpolation}\n`);
    });
  }

  public setBrightness(brightness: number): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.socket || !this.isConnected) return reject('ceiled-driver not connected');
      const cmd = `set brightness ${Math.round(brightness)}\n`;
      this.expectResponseOk(resolve, reject);
      this.socket.write(cmd);
    });
  }

  public getBrightness(): Promise<number> {
    return this.getNumber('brightness');
  }

  public setRoomlight(roomlight: number): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.socket || !this.isConnected) return reject('ceiled-driver not connected');
      const cmd = `set roomlight ${Math.round(roomlight)}\n`;
      this.expectResponseOk(resolve, reject);
      this.socket.write(cmd);
    });
  }

  public getRoomlight(): Promise<number> {
    return this.getNumber('roomlight');
  }

  public setFlux(flux: number): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.socket || !this.isConnected) return reject('ceiled-driver not connected');
      const cmd = `set flux ${Math.round(flux)}\n`;
      this.expectResponseOk(resolve, reject);
      this.socket.write(cmd);
    });
  }

  public getFlux(): Promise<number> {
    return this.getNumber('flux');
  }

  private getNumber(name: string): Promise<number> {
    return new Promise(async (resolve, reject) => {
      if (!this.socket || !this.isConnected) return reject('ceiled-driver not connected');
      const cmd = `get ${name}\n`;
      const promise = this.expectReply();
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

  private expectResponseOk(resolve: (result?: any) => void, reject: (error?: any) => void): void {
    this.socket.once('data', (data: Buffer) => {
      const res = data.toString();
      if (res.trim() === 'ok') resolve();
      else reject(res.trim());
    });
  }

  private expectReply(): Promise<string> {
    return new Promise((resolve, reject) => {
      this.socket.once('data', (data: Buffer) => resolve(data.toString()));
    });
  }
}

const buildChannelString = (channels: number[]): string =>
  channels.reduce((acc, ch) => acc + ',' + ch, '').slice(1);

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
