import Color from '../common/Color';
import { Driver } from '../hardware/Driver';
import Pattern from './Pattern';

/**
 * Shows a solid pattern. See the API documentation for more details on this pattern.
 */
class SolidPattern implements Pattern {
  private colors: Color[];

  constructor(colors: Color[]) {
    this.colors = colors;
  }

  /**
   * Shows this pattern.
   */
  public async show(driver: Driver): Promise<void> {
    if (!driver) return;

    this.colors.splice(3);
    if (this.colors.length === 0) {
      // no colours in a SolidPattern means turn off
      driver.off();
      return;
    }

    if (this.colors.length === 1) {
      await driver.setColor([0, 1, 2], this.colors[0]);
    } else if (this.colors.length === 2) {
      const colors = new Map<number, Color>();
      colors.set(0, this.colors[0]);
      colors.set(1, this.colors[1]);
      colors.set(2, this.colors[0]);
      await driver.setColors(colors);
    } else {
      const colors = new Map<number, Color>();
      colors.set(0, this.colors[0]);
      colors.set(1, this.colors[1]);
      colors.set(2, this.colors[2]);
      await driver.setColors(colors);
    }
  }

  public stop(): void {
    // there is no need to stop this pattern, since it is not continually set.
  }
}

export default SolidPattern;