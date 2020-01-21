import Color from '../common/Color';
import { Driver } from '../hardware/Driver';
import { Pattern, PatternType } from './Pattern';
import { range } from './utils';

export class FadePattern implements Pattern {
  public type: PatternType.FADE_LINEAR | PatternType.FADE_SIGMOID;
  public length: number;
  public colors: Color[];

  constructor(
    type: PatternType.FADE_LINEAR | PatternType.FADE_SIGMOID,
    length: number,
    colors: Color[],
  ) {
    this.type = type;
    this.length = length;
    this.colors = colors;
  }

  // TODO: properly implement fade patterns
  public show(channel: number | 'all', driver: Driver): Promise<void> {
    const colors = new Map<number, Color>();
    if (channel === 'all') {
      for (const i of range(driver.channels)) {
        colors.set(i, this.colors[0]);
      }
    } else {
      colors.set(channel, this.colors[0]);
    }

    return driver.setColors(colors);
  }

  public stop(): void {
    // TODO: implement this
  }
}
