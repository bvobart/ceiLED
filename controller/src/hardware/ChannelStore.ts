import LEDChannel from './LEDChannel';

class ChannelStore {
  public channel1: LEDChannel;
  public channel2: LEDChannel;
  public channel3: LEDChannel;

  constructor() {
    this.channel1 = new LEDChannel(1);
    this.channel2 = new LEDChannel(2);
    this.channel3 = new LEDChannel(3);
  }
}

export default new ChannelStore();
