import Color from '../common/Color';
import Pin from './Pin';

/**
 * Defines a mapping between a channels colours (red, green and blue) and their respective
 * pin numbers.
 */
interface ChannelMapping {
  red: number;
  green: number;
  blue: number;
}

/**
 * Map to contain the mappings for the different channels.
 */
interface ChannelMap {
  [key: number]: ChannelMapping
}

/**
 * Represents and controls a single LED channel, i.e. LED strip(s).
 * The number given to it defines what pins the red, green and blue parts of the LED channel
 * are mapped to.
 */
class LEDChannel {
  private static channelMap: ChannelMap = {
    1: { red: 0, green: 1, blue: 2},
    2: { red: 3, green: 4, blue: 5},
    3: { red: 6, green: 7, blue: 8},
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
    const channelMapping: ChannelMapping = LEDChannel.channelMap[this.number];
    if (channelMapping) {
      this.red = new Pin(channelMapping.red);
      this.green = new Pin(channelMapping.green);
      this.blue = new Pin(channelMapping.blue);
      this.setColor(Color.BLACK);
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