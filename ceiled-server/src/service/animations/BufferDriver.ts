import Color from '../../common/Color';
import { Driver } from '../../hardware/Driver';
import { InterpolationType } from '../../hardware/interpolate';

export class BufferDriver implements Driver {
  channels: number;

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

  async setColors(colors: Map<number, Color>): Promise<void> {
    for (const [channel, color] of colors.entries()) {
      this.colorBuffer.set(channel, color);
    }
    return Promise.resolve();
  }

  async setFades(
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

  async connect(): Promise<void> {
    return this.driver.connect();
  }

  close(): void {
    return this.driver.close();
  }

  async off(): Promise<void> {
    return this.driver.off();
  }

  async setBrightness(brightness: number): Promise<void> {
    return this.setBrightness(brightness);
  }

  async getBrightness(): Promise<number> {
    return this.driver.getBrightness();
  }

  async setRoomlight(roomlight: number): Promise<void> {
    return this.driver.setRoomlight(roomlight);
  }

  async getRoomlight(): Promise<number> {
    return this.driver.getRoomlight();
  }

  async setFlux(flux: number): Promise<void> {
    return this.driver.setFlux(flux);
  }

  async getFlux(): Promise<number> {
    return this.driver.getFlux();
  }
}
