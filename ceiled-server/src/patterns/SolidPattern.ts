import Color from '../common/Color';
import { Driver } from '../hardware/Driver';
import Pattern from './Pattern';

export class SolidPattern implements Pattern {
  public variant: 'solid' = 'solid';
  public color: Color;

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
