import Color from '../common/Color';
import { Driver } from '../hardware/Driver';
import { InterpolationType } from '../hardware/interpolate';
import { Pattern, PatternType } from './Pattern';
import { range } from './utils';

export class FadePattern implements Pattern {
  type: PatternType.FadeLinear | PatternType.FadeSigmoid;
  length: number;
  colors: Color[];

  private index = 0;

  constructor(
    type: PatternType.FadeLinear | PatternType.FadeSigmoid,
    length: number,
    colors: Color[],
  ) {
    this.type = type;
    this.length = length;
    this.colors = colors;
  }

  async show(channel: number | 'all', driver: Driver, speed: number): Promise<void> {
    const nextColor = this.colors[this.index++];
    if (this.index === this.length) this.index = 0;

    const colors = new Map<number, Color>();
    if (channel === 'all') {
      for (const i of range(driver.channels)) colors.set(i, nextColor);
    } else {
      colors.set(channel, nextColor);
    }

    const duration = (60 * 1000) / speed; // (60 sec/min * 1000) / x beats/min = 60/x sec/beat * 1000 = (60*1000)/x ms/beat
    const interpolation = interpType(this.type);
    return driver.setFades(colors, duration, interpolation);
  }
}

const interpType = (type: PatternType.FadeLinear | PatternType.FadeSigmoid): InterpolationType => {
  if (type === PatternType.FadeLinear) return InterpolationType.LINEAR;
  else return InterpolationType.SIGMOID;
};
