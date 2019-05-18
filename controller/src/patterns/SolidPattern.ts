import Color from '../common/Color';
import ChannelStore from '../hardware/ChannelStore';
import { settings } from '../server';
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
  public show(): void {
    this.colors.splice(3);

    const { channel1, channel2, channel3 } = settings.channelStore;
    if (this.colors.length === 0) {
      // no colours in a SolidPattern means turn off
      channel1.setColorDirectly(Color.BLACK);
      channel2.setColorDirectly(Color.BLACK);
      channel3.setColorDirectly(Color.BLACK);
      return;
    }

    channel1.setColor(this.colors[0]);
    channel2.setColor(this.colors[1] ? this.colors[1] : this.colors[0]);
    channel3.setColor(this.colors[2] ? this.colors[2] : this.colors[0]);
  }

  public stop(): void {
    // there is no need to stop this pattern, since it is not continually set.
  }
}

export default SolidPattern;
