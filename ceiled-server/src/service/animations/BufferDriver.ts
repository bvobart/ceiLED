import Color from '../../common/Color';
import { Driver } from '../../hardware/Driver';
import { InterpolationType } from '../../hardware/interpolate';

export class BufferDriver implements Driver {
  public channels: number;

  // the underlying driver
  private driver: Driver;

  // the buffers. These will hold all setColors and setFades commands before being flushed
  private colorBuffer: Map<number, Color>;
  private fadeBuffer: Map<number, Color>;
  private lastMillis = 0;
  private lastInterp = InterpolationType.LINEAR;

  constructor(driver: Driver) {
    this.driver = driver;
    this.channels = driver.channels;
    this.colorBuffer = new Map<number, Color>();
    this.fadeBuffer = new Map<number, Color>();
  }

  public setColors(colors: Map<number, Color>): Promise<void> {
    for (const [channel, color] of colors.entries()) {
      this.colorBuffer.set(channel, color);
    }
    return Promise.resolve();
  }

  public setFades(
    colors: Map<number, Color>,
    millis: number,
    interpolation: InterpolationType = InterpolationType.LINEAR,
  ): Promise<void> {
    for (const [channel, color] of colors.entries()) {
      this.fadeBuffer.set(channel, color);
    }
    this.lastMillis = millis;
    this.lastInterp = interpolation;
    return Promise.resolve();
  }

  public async flush(): Promise<void> {
    await this.driver.setColors(this.colorBuffer);
    await this.driver.setFades(this.fadeBuffer, this.lastMillis, this.lastInterp);
    this.colorBuffer.clear();
    this.fadeBuffer.clear();
  }

  public connect(): Promise<void> {
    return this.driver.connect();
  }

  public close(): void {
    return this.driver.close();
  }

  public off(): Promise<void> {
    return this.driver.off();
  }

  public setBrightness(brightness: number): Promise<void> {
    return this.setBrightness(brightness);
  }

  public getBrightness(): Promise<number> {
    return this.driver.getBrightness();
  }

  public setRoomlight(roomlight: number): Promise<void> {
    return this.driver.setRoomlight(roomlight);
  }

  public getRoomlight(): Promise<number> {
    return this.driver.getRoomlight();
  }

  public setFlux(flux: number): Promise<void> {
    return this.driver.setFlux(flux);
  }

  public getFlux(): Promise<number> {
    return this.driver.getFlux();
  }
}
