import Color from '../common/Color';
import { CeiledDriver } from '../hardware/CeiledDriver';
import SolidPattern from './SolidPattern';

jest.mock('../hardware/CeiledDriver');

describe('SolidPattern', () => {
  it('shows one solid colour', () => {
    const driver = new CeiledDriver(null, 3);
    const pattern: SolidPattern = new SolidPattern([Color.RED]);
    pattern.show(driver);
    expect(driver.setColor).toHaveBeenCalledWith([0, 1, 2], Color.RED);
  });

  it('shows two solid colours', () => {
    const driver = new CeiledDriver(null, 3);
    const pattern: SolidPattern = new SolidPattern([Color.RED, Color.BLUE]);
    pattern.show(driver);
    expect(driver.setColor).toHaveBeenCalledWith([0, 2], Color.RED);
    expect(driver.setColor).toHaveBeenCalledWith([1], Color.BLUE);
  });

  it('shows three solid colours', () => {
    const driver = new CeiledDriver(null, 3);
    const pattern: SolidPattern = new SolidPattern([Color.RED, Color.BLUE, Color.GREEN]);
    pattern.show(driver);
    expect(driver.setColor).toHaveBeenCalledWith([0], Color.RED);
    expect(driver.setColor).toHaveBeenCalledWith([1], Color.BLUE);
    expect(driver.setColor).toHaveBeenCalledWith([2], Color.GREEN);
  });
});
