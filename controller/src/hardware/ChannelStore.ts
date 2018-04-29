import LEDChannel from './LEDChannel';

/**
 * Singleton class that stores the instances of the available channels.
 */
class ChannelStore {

  /**
   * Returns the instance of this class. The instance is not created until the first
   * invocation of this method, which allows this method (and thus ChannelStore) to be mocked.
   */
  public static getInstance(): ChannelStore {
    if (!ChannelStore.instance) ChannelStore.instance = new ChannelStore();
    return ChannelStore.instance;
  }

  private static instance: ChannelStore;

  /** LED Channel 1 */
  public channel1: LEDChannel;
  /** LED Channel 2 */
  public channel2: LEDChannel;
  /** LED Channel 3 */
  public channel3: LEDChannel;

  private constructor() {
    this.channel1 = new LEDChannel(1);
    this.channel2 = new LEDChannel(2);
    this.channel3 = new LEDChannel(3);
  }

}

export default ChannelStore;
