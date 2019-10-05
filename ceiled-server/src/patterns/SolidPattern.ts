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

    try {
      const colors = new Map<number, Color>();

      if (this.colors.length === 1) {
        // single channel
        colors.set(0, this.colors[0]);
        colors.set(1, this.colors[0]);
        colors.set(2, this.colors[0]);
        await driver.setColors(colors);
      } else if (this.colors.length === 2) {
        // dual channel
        colors.set(0, this.colors[0]);
        colors.set(1, this.colors[1]);
        colors.set(2, this.colors[0]);
        await driver.setColors(colors);
      } else {
        // triple channel
        colors.set(0, this.colors[0]);
        colors.set(1, this.colors[1]);
        colors.set(2, this.colors[2]);
        await driver.setColors(colors);
      }
    } catch (err) {
      console.error('--> Error has occurred while applying solid pattern:');
      console.error('-->', err);
    }
  }

  public stop(): void {
    // there is no need to stop this pattern, since it is not continually set.
  }
}

export default SolidPattern;
