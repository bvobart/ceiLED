import Color from '../common/Color';
import { settings } from '../server';
import SolidPattern from './SolidPattern';

describe('SolidPattern', () => {
  let storeMock: any;

  beforeEach(() => {
    storeMock = {
      channel1: { setColor: jest.fn() },
      channel2: { setColor: jest.fn() },
      channel3: { setColor: jest.fn() },
    };
    settings.channelStore = storeMock;
    settings.brightness = 100;
    settings.roomLight = 0;
    settings.flux = 0;
  });

  it('shows one solid colour', () => {
    const pattern: SolidPattern = new SolidPattern([Color.RED]);
    pattern.show();
    expect(storeMock.channel1.setColor).toHaveBeenCalledWith(Color.RED);
    expect(storeMock.channel2.setColor).toHaveBeenCalledWith(Color.RED);
    expect(storeMock.channel3.setColor).toHaveBeenCalledWith(Color.RED);
    pattern.stop();
  });

  it('shows two solid colours', () => {
    const pattern: SolidPattern = new SolidPattern([Color.RED, Color.BLUE]);
    pattern.show();
    expect(storeMock.channel1.setColor).toHaveBeenCalledWith(Color.RED);
    expect(storeMock.channel2.setColor).toHaveBeenCalledWith(Color.BLUE);
    expect(storeMock.channel3.setColor).toHaveBeenCalledWith(Color.RED);
    pattern.stop();
  });

  it('shows three solid colours', () => {
    const pattern: SolidPattern = new SolidPattern([Color.RED, Color.BLUE, Color.GREEN]);
    pattern.show();
    expect(storeMock.channel1.setColor).toHaveBeenCalledWith(Color.RED);
    expect(storeMock.channel2.setColor).toHaveBeenCalledWith(Color.BLUE);
    expect(storeMock.channel3.setColor).toHaveBeenCalledWith(Color.GREEN);
    pattern.stop();
  });
});
