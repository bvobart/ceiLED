import Color from '../common/Color';
import { Driver } from '../hardware/Driver';
import { Pattern, PatternType } from './Pattern';
import { range } from './utils';

export class SolidPattern implements Pattern {
  type: PatternType.Solid = PatternType.Solid;
  length: number;
  color: Color;

  constructor(length: number, color: Color) {
    this.length = length;
    this.color = color;
  }

  async show(channel: number | 'all', driver: Driver): Promise<void> {
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
}
