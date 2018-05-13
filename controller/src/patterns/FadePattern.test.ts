import Color from '../common/Color';
import FadePattern from './FadePattern';
import { FadeType } from './options/FadePatternOptions';

describe('FadePattern', () => {
  describe('normal fade', () => {
    it.only('shows continuously, stops correctly', async done => {
      const colors: Color[] = [Color.RED, Color.GREEN, Color.BLUE];
      const pattern: FadePattern = new FadePattern(colors, 100, 0, {
        speed: 120,
        channels: 1,
        fadeType: FadeType.NORMAL
      });

      pattern.show();
      setTimeout(() => {
        pattern.stop();
        done();
      }, 4500);
    });
        
    it('correctly fades on one channel', async done => {
      const colors: Color[] = [Color.RED, Color.GREEN, Color.BLUE];
      const pattern: FadePattern = new FadePattern(colors, 100, 0, {
        speed: 120,
        channels: 1,
        fadeType: FadeType.NORMAL
      });

      await pattern.fadeNormalOnce();

      done();

      // TODO: Set test oracles by mocking setFade on ChannelStore channels.
    });
  });
});