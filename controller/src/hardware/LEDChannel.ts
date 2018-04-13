import Color from '../common/Color';
import Pin from './Pin';

/**
 * Defines a mapping between a channels colours (red, green and blue) and their respective
 * pin numbers.
 */
interface IChannelMapping {
  red: number;
  green: number;
  blue: number;
}

/**
 * Map to contain the mappings for the different channels.
 */
interface IChannelMap {
  [key: number]: IChannelMapping
}

/**
 * Represents and controls a single LED channel, i.e. LED strip(s).
 * The number given to it defines what pins the red, green and blue parts of the LED channel
 * are mapped to.
 */
class LEDChannel {
  private static channelMap: IChannelMap = {
    1: { red: 3, green: 5, blue: 7},
    2: { red: 11, green: 13, blue: 15},
    3: { red: 19, green: 21, blue: 23},
  }

  /** Channel number */
  public number: number;

  /** Red pin */
  public red: Pin;
  /** Green pin */
  public green: Pin;
  /** Blue pin */
  public blue: Pin;

  /**
   * Creates and initialises an LED channel, i.e. LED strip.
   * @param channelNr Channel number
   */
  constructor(channelNr: number) {
    this.number = channelNr;
    const channelMapping: IChannelMapping = LEDChannel.channelMap[this.number];
    if (channelMapping) {
      this.red = new Pin(channelMapping.red);
      this.green = new Pin(channelMapping.green);
      this.blue = new Pin(channelMapping.blue);
      this.setColor({ red: 0, green: 0, blue: 0 });
    } else {
      throw new Error('Channel ' + this.number + ' does not exist!');
    }
  }

  /**
   * Sets a color on the LED channel.
   * @param color Color to set
   */
  public setColor(color: Color): void {
    this.red.value = color.red;
    this.green.value = color.green;
    this.blue.value = color.blue;
  }
}

export default LEDChannel;