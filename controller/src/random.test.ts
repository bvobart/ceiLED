import Color from './common/Color';
import ChannelStore from './hardware/ChannelStore';
import FadePattern, { FadeType } from './patterns/FadePattern';

jest.unmock('pca9685');

it('jemoeder', async done => {
  console.time('jemoeder');
  const colors: Color[] = [Color.RED, Color.GREEN, Color.BLUE];
  const pattern: FadePattern = new FadePattern(colors, 100, 0, {
    speed: 120,
    channels: 1,
    fadeType: FadeType.NORMAL
  });
  console.timeEnd('jemoeder');
  done();
});
