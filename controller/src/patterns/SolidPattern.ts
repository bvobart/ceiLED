import Color from '../common/Color';
import ChannelStore from '../hardware/ChannelStore';
import { settings } from '../server';
import Pattern from './Pattern';

/**
 * Shows a solid pattern. See the API documentation for more details on this pattern.
 */
class SolidPattern implements Pattern {
  private colors: Color[];
  private brightness: number;
  private roomLight: number;

  constructor(colors: Color[], brightness: number, roomLight: number) {
    this.colors = colors;
    this.brightness = brightness;
    this.roomLight = roomLight;
  }

  /**
   * Shows this pattern.
   */
  public show(): void {
    this.colors.splice(3);
    this.colors.map((color: Color) => 
      color.withRoomLight(this.roomLight)
           .withBrightness(this.brightness)
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
