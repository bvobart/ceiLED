import Color from '../common/Color';
import ChannelStore from '../hardware/ChannelStore';
import SolidPattern from './SolidPattern';

describe('SolidPattern', () => {
  beforeEach(() => {
    const storeMock: any = {
      channel1: { setColor: jest.fn() },
      channel2: { setColor: jest.fn() },
      channel3: { setColor: jest.fn() }
    };
    ChannelStore.getInstance = jest.fn(() => storeMock);
  });

  it('shows one solid colour', () => {
    const pattern: SolidPattern = new SolidPattern([Color.RED], 100, 0);
    pattern.show();
    expect(ChannelStore.getInstance().channel1.setColor).toHaveBeenCalledWith(Color.RED);
    expect(ChannelStore.getInstance().channel2.setColor).toHaveBeenCalledWith(Color.RED);
    expect(ChannelStore.getInstance().channel3.setColor).toHaveBeenCalledWith(Color.RED);
    pattern.stop();
  });

  it('shows two solid colours', () => {
    const pattern: SolidPattern = new SolidPattern([Color.RED, Color.BLUE], 100, 0);
    pattern.show();
    expect(ChannelStore.getInstance().channel1.setColor).toHaveBeenCalledWith(Color.RED);
    expect(ChannelStore.getInstance().channel2.setColor).toHaveBeenCalledWith(Color.BLUE);
    expect(ChannelStore.getInstance().channel3.setColor).toHaveBeenCalledWith(Color.RED);
    pattern.stop();
  });

  it('shows three solid colours', () => {
    const pattern: SolidPattern = new SolidPattern([Color.RED, Color.BLUE, Color.GREEN], 100, 0);
    pattern.show();
    expect(ChannelStore.getInstance().channel1.setColor).toHaveBeenCalledWith(Color.RED);
    expect(ChannelStore.getInstance().channel2.setColor).toHaveBeenCalledWith(Color.BLUE);
    expect(ChannelStore.getInstance().channel3.setColor).toHaveBeenCalledWith(Color.GREEN);
    pattern.stop();
  });
});