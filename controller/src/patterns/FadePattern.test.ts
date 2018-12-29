import Color from '../common/Color';
import FadePattern from './FadePattern';
import { FadePatternOptions, FadeType } from './options/FadePatternOptions';

describe('FadePattern', () => {
  describe('normal fade', () => {
    it('shows continuously, stops correctly', async done => {
      const colors: Color[] = [Color.RED, Color.GREEN, Color.BLUE];
      const pattern: FadePattern = new FadePattern(
        colors,
        new FadePatternOptions({
          speed: 120,
          channels: 1,
          fadeType: FadeType.NORMAL,
        }),
      );

      pattern.show();
      setTimeout(() => {
        pattern.stop();
        done();
      }, 1000);
    });

    it('correctly fades on one channel', async done => {
      const colors: Color[] = [Color.RED, Color.GREEN, Color.BLUE];
      const pattern: FadePattern = new FadePattern(
        colors,
        new FadePatternOptions({
          speed: 120,
          channels: 1,
          fadeType: FadeType.NORMAL,
        }),
      );

      await pattern.fadeNormalOnce();

      done();

      // TODO: Set test oracles by mocking setFade on ChannelStore channels.
    });
  });
});
