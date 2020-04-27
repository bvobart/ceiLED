import { mocked } from 'ts-jest/utils';
import Color from '../common/Color';
import { InterpolationType } from '../hardware/interpolate';
import { FadePattern } from './FadePattern';
import { PatternType } from './Pattern';
import { range } from './utils';

import { CeiledDriver } from '../hardware/CeiledDriver';
jest.mock('../hardware/CeiledDriver.ts');

describe('FadePattern', () => {
  it('show() sets the right fades on the driver', async done => {
    const driver = mocked(new CeiledDriver('mocked', 1), true);
    const colors = [Color.PURPLE, Color.RED, Color.BLUE];
    const length = 3;
    const pattern = new FadePattern(PatternType.FADE_LINEAR, length, colors);

    // expected behaviour: call setFades with purple, then red, then blue
    for (const i of range(length)) {
      await pattern.show(0, driver, 120);
      const fades = new Map().set(0, colors[i]);
      expect(driver.setFades).toHaveBeenCalledWith(fades, 500, InterpolationType.LINEAR);
      driver.setFades.mockClear();
    }

    // when the pattern completes one cycle, expect it to reset and start over from the beginning
    // doing exactly the same thing. Split so it is clearer where bug happens if this test fails.
    for (const rep of [0, 1]) {
      for (const i of range(length)) {
        await pattern.show(0, driver, 120);
        const fades = new Map().set(0, colors[i]);
        expect(driver.setFades).toHaveBeenCalledWith(fades, 500, InterpolationType.LINEAR);
        driver.setFades.mockClear();
      }
    }

    done();
  });
});

// TODO: expand this test?
