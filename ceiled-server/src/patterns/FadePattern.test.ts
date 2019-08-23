import Color from '../common/Color';
import { CeiledDriver } from '../hardware/CeiledDriver';
import FadePattern from './FadePattern';
import { FadePatternOptions, FadeType, InterpolationType } from './options/FadePatternOptions';

jest.useFakeTimers();
jest.mock('../hardware/CeiledDriver');

describe('FadePattern', () => {
  describe('normal fade', () => {
    it('shows continuously, stops correctly', async done => {
      const driver = new CeiledDriver(null, 3);
      const colors: Color[] = [Color.RED, Color.GREEN, Color.BLUE];
      const pattern: FadePattern = new FadePattern(
        colors,
        new FadePatternOptions({
          speed: 120,
          channels: 1,
          fadeType: FadeType.NORMAL,
          interpolation: InterpolationType.LINEAR,
        }),
      );

      await pattern.show(driver);
      expect(driver.setFade).toHaveBeenCalledWith(
        [0, 1, 2],
        Color.RED,
        500,
        InterpolationType.LINEAR,
      );
      expect(setInterval).toHaveBeenCalled();
      jest.advanceTimersByTime(500);
      expect(driver.setFade).toHaveBeenLastCalledWith(
        [0, 1, 2],
        Color.GREEN,
        500,
        InterpolationType.LINEAR,
      );
      await pattern.stop();
      done();
    });
  });
});
