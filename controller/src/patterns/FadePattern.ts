import Color from '../common/Color';
import { settings } from '../server';
import { FadePatternOptions, FadeType } from './options/FadePatternOptions';
import Pattern from './Pattern';

class FadePattern implements Pattern {
  private channels: number;
  private colors1: Color[];
  private colors2: Color[];
  private colors3: Color[];
  private brightness: number;
  private roomLight: number;
  private speed: number;
  private type: FadeType;
  private shouldShow: boolean;

  constructor(colors: Color[], brightness: number, roomLight: number, options: FadePatternOptions) {
    this.channels = options.channels;
    this.colors1 = colors;
    this.brightness = brightness;
    this.roomLight = roomLight;
    this.speed = options.speed;
    this.type = options.fadeType;

    if (this.type === FadeType.NORMAL || this.type === FadeType.INVERTED) {
      this.colors2 = options.colors2;
      this.colors3 = options.colors3;
    } else {
      this.colors1 = this.colors1.concat(options.colors2, options.colors3);
    }
  }

  public async show(): Promise<void> {
    this.shouldShow = true;
    return new Promise<void>(async (resolve, reject) => {
      while (this.shouldShow) {
        switch (this.type) {
          case FadeType.NORMAL:
            await this.fadeNormalOnce();
            break;
          case FadeType.INVERTED:
            await this.fadeInvertedOnce();
            break;
          default:
            throw Error('Unknown FadeType: ' + this.type);
        }
      }
    })
  }

  public async stop(): Promise<void> {
    this.shouldShow = false;
  }

  /**
   * Will fade 'normally' across all colours. This method blocks.
   */
  public async fadeNormalOnce(): Promise<void> {
    let prevColor1: Color = settings.channelStore.channel1.getColor();
    let prevColor2: Color = settings.channelStore.channel2.getColor();
    let prevColor3: Color = settings.channelStore.channel3.getColor();
    let ch2Color: Color;
    let ch3Color: Color;

    for (let index = 0; index < this.colors1.length; index++) {
      const ch1Color: Color = this.colors1[index];

      if (this.channels === 2) {
        // on 2 channels: channel 1 and 3 have the same colour, channel 2 has its own colour.
        ch2Color = this.colors2[index] ? this.colors2[index] : ch1Color;
        ch3Color = ch1Color;
      } else if (this.channels === 3) {
        // on 3 channels: each channel has its own colour.
        ch2Color = this.colors2[index] ? this.colors2[index] : ch1Color;
        ch3Color = this.colors3[index] ? this.colors3[index] : ch1Color;
      } else {
        // on 1 channel: all channels have the same colour.
        ch2Color = ch1Color;
        ch3Color = ch1Color;
      }

      const duration: number = 60 / this.speed;

      await Promise.all([
        settings.channelStore.channel1.setFade(prevColor1, ch1Color, duration),
        settings.channelStore.channel2.setFade(prevColor2, ch2Color, duration),
        settings.channelStore.channel3.setFade(prevColor3, ch3Color, duration),
      ]);

      prevColor1 = ch1Color;
      prevColor2 = ch2Color;
      prevColor3 = ch3Color;
    }

    return Promise.resolve();
  }

  public fadeInvertedOnce(): void {
    this.fadeNormalOnce();
  }
}

export default FadePattern;
export { FadeType, FadePatternOptions };
