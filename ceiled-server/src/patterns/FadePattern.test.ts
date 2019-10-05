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

      const colors1 = new Map<number, Color>();
      colors1.set(0, Color.RED);
      colors1.set(1, Color.RED);
      colors1.set(2, Color.RED);
      expect(driver.setFades).toHaveBeenCalledWith(colors1, 500, InterpolationType.LINEAR);
      expect(setInterval).toHaveBeenCalled();

      jest.advanceTimersByTime(500);

      const colors2 = new Map<number, Color>();
      colors2.set(0, Color.GREEN);
      colors2.set(1, Color.GREEN);
      colors2.set(2, Color.GREEN);
      expect(driver.setFades).toHaveBeenLastCalledWith(colors2, 500, InterpolationType.LINEAR);
      expect(setInterval).toHaveBeenCalled();

      await pattern.stop();
      done();
    });
  });
});
