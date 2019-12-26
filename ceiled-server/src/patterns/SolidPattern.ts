import Color from '../common/Color';
import { Driver } from '../hardware/Driver';
import { Pattern, PatternType } from './Pattern';

export class SolidPattern implements Pattern {
  public type: PatternType = PatternType.SOLID;
  public length: number;
  public color: Color;

  constructor(length: number, color: Color) {
    this.length = length;
    this.color = color;
  }

  public show(channel: number | 'all', driver: Driver): Promise<void> {
    const colors = new Map<number, Color>();
    if (channel === 'all') {
      for (const i of range(driver.channels)) {
        colors.set(i, this.color);
      }
    } else {
      colors.set(channel, this.color);
    }

    return driver.setColors(colors);
  }

  public stop(): void {
    // there is no need to stop this pattern, since it is not continually set.
  }
}
