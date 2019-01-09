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
    this.colors.map((color: Color) =>
      color
        .withRoomLight(settings.roomLight)
        .withBrightness(settings.brightness)
        .withFlux(settings.flux),
    );

    const store: ChannelStore = settings.channelStore;
    store.channel1.setColor(this.colors[0]);
    store.channel2.setColor(this.colors[1] ? this.colors[1] : this.colors[0]);
    store.channel3.setColor(this.colors[2] ? this.colors[2] : this.colors[0]);
  }

  public stop(): void {
    // there is no need to stop this pattern, since it is not continually set.
  }
}

export default SolidPattern;
