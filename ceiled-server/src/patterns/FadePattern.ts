import Color from '../common/Color';
import { Driver } from '../hardware/Driver';
import { FadePatternOptions, FadeType, InterpolationType } from './options/FadePatternOptions';
import Pattern from './Pattern';

class FadePattern implements Pattern {
  private channels: number;
  private colors1: Color[];
  private colors2: Color[];
  private colors3: Color[];
  private speed: number;
  private type: FadeType;
  private interpolation: InterpolationType;

  private shouldShow: boolean;
  private interval: NodeJS.Timeout;

  constructor(colors: Color[], options: FadePatternOptions) {
    this.channels = options.channels;
    this.colors1 = colors;
    this.speed = options.speed ? options.speed : 0.1;
    this.type = options.fadeType;
    this.interpolation = options.interpolation;

    if (this.type === FadeType.NORMAL || this.type === FadeType.INVERTED) {
      this.colors2 = options.colors2;
      this.colors3 = options.colors3;
    } else {
      this.colors1 = this.colors1.concat(options.colors2, options.colors3);
    }
  }

  public async show(driver: Driver): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.shouldShow = true;
      let index = 0;
      const duration = (60 * 1000) / this.speed; // (sec/min * 1000) / beats/min = sec/beat * 1000 = ms/beat
      const fadeFunc = async () => {
        if (!this.shouldShow) {
          clearInterval(this.interval);
          return;
        }

        if (this.channels === 3) {
          // on 3 channels: each channel has its own colour.
          const colors = new Map<number, Color>();
          colors.set(0, this.colors1[index]);
          colors.set(1, this.colors2[index]);
          colors.set(2, this.colors3[index]);
          await driver.setFades(colors, duration, this.interpolation);
        } else if (this.channels === 2) {
          // on 2 channels: channel 1 and 3 have the same colour, channel 2 has its own colour.
          const colors = new Map<number, Color>();
          colors.set(0, this.colors1[index]);
          colors.set(1, this.colors2[index]);
          colors.set(2, this.colors1[index]);
          await driver.setFades(colors, duration, this.interpolation);
        } else {
          // on 1 channel: all channels have the same colour.
          await driver.setFade([0, 1, 2], this.colors1[index], duration, this.interpolation);
        }

        index = index + 1;
        if (index === this.colors1.length) index = 0;
      };

      fadeFunc();
      this.interval = setInterval(fadeFunc, duration);
      resolve();
    });
  }

  public async stop(): Promise<void> {
    this.shouldShow = false;
  }
}

export default FadePattern;
export { FadeType, FadePatternOptions };
