import { createConnection, Socket } from 'net';
import Color from '../common/Color';
import { InterpolationType } from '../patterns/options/FadePatternOptions';
import { Driver } from './Driver';

const CMD_OFF = 'set all solid 0 0 0\n';
const CMD_GET = 'get\n';

export class CeiledDriver implements Driver {
  public channels: number;
  private socketFileName: string;
  private socket: Socket;

  constructor(file: string, channels: number) {
    this.channels = channels;
    this.socketFileName = file;
  }

  public connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.socket = createConnection(this.socketFileName, () => {
        console.log('ceiled-driver connected');
        resolve();
      }).on('error', (err: Error) => {
        reject('failed to connect to ceiled-driver: ' + err.message + '\n' + err.stack);
      });
    });
  }

  public close(): void {
    if (this.socket) {
      this.socket.end();
      this.socket = null;
    }
  }

  public off(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.socket) reject('ceiled-driver not connected');
      this.socket.write(CMD_OFF);
      resolve();
    });
  }

  public getColor(): Promise<Color> {
    return new Promise((resolve, reject) => {
      if (!this.socket) reject('ceiled-driver not connected');
      // TODO: this technically only gets the last set color, without care for which channel it was set on
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
              blue: parseInt(rgb[0], 10),
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
      if (!this.socket) reject('ceiled-driver not connected');
      const chStr = buildChannelString(channels);
      this.socket.once('data', (data: Buffer) => {
        const res = data.toString();
        if (res.trim() === 'ok') resolve();
        else reject(res.trim());
      });
      this.socket.write(`set ${chStr} solid ${color.red} ${color.green} ${color.blue}\n`);
    });
  }

  public setFade(
    channels: number[],
    to: Color,
    millis: number,
    interpolation: InterpolationType = InterpolationType.LINEAR,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.socket) reject('ceiled-driver not connected');
      const chStr = buildChannelString(channels);
      const interpStr = interpolation === InterpolationType.SIGMOID ? 'sigmoid' : 'linear';
      this.socket.once('data', (data: Buffer) => {
        const res = data.toString();
        if (res.trim() === 'ok') resolve();
        else reject(res.trim());
      });
      this.socket.write(
        `set ${chStr} fade ${to.red} ${to.green} ${to.blue} ${millis} ${interpStr}\n`,
      );
    });
  }
}

const buildChannelString = (channels: number[]): string =>
  channels.reduce((acc, ch) => acc + ',' + ch, '').slice(1);
