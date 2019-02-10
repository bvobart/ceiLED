import * as Bluebird from 'bluebird';
import Color from '../common/Color';
import { settings } from '../server';
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
  private awaiting: Bluebird<[void, void, void]>;

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

    const applyGlobals = (color: Color) =>
      color
        .withRoomLight(settings.roomLight)
        .withFlux(settings.flux)
        .withBrightness(settings.brightness);
    this.colors1 = this.colors1.map(applyGlobals);
    this.colors2 = this.colors2.map(applyGlobals);
    this.colors3 = this.colors3.map(applyGlobals);
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
            reject('Unknown FadeType: ' + this.type);
        }
      }
      return resolve();
    });
  }

  public async stop(): Promise<void> {
    this.shouldShow = false;
    if (this.awaiting) this.awaiting.cancel();
  }

  /**
   * Will fade 'normally' across all colours. This method blocks.
   */
  public async fadeNormalOnce(): Promise<void> {
    let ch1Color: Color;
    let ch2Color: Color;
    let ch3Color: Color;

    for (let index = 0; index < this.colors1.length; index++) {
      if (!this.shouldShow) break;

      ch1Color = this.colors1[index];
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

      this.awaiting = Bluebird.all([
        settings.channelStore.channel1.setFade(ch1Color, duration, this.interpolation),
        settings.channelStore.channel2.setFade(ch2Color, duration, this.interpolation),
        settings.channelStore.channel3.setFade(ch3Color, duration, this.interpolation),
      ]);
      await this.awaiting;
    }

    return Promise.resolve();
  }

  public fadeInvertedOnce(): void {
    this.fadeNormalOnce();
  }
}

export default FadePattern;
export { FadeType, FadePatternOptions };
