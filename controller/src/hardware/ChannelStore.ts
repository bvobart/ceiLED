import LEDChannel from './LEDChannel';

/**
 * Class that stores the instances of the available channels.
 */
class ChannelStore {
  /** LED Channel 1 */
  public channel1: LEDChannel;
  /** LED Channel 2 */
  public channel2: LEDChannel;
  /** LED Channel 3 */
  public channel3: LEDChannel;

  constructor() {
    this.channel1 = new LEDChannel(1);
    this.channel2 = new LEDChannel(2);
    this.channel3 = new LEDChannel(3);
  }
}

export default ChannelStore;
