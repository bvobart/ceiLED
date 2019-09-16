import Color from '../common/Color';
import { CeiledDriver } from '../hardware/CeiledDriver';
import SolidPattern from './SolidPattern';

jest.mock('../hardware/CeiledDriver');

describe('SolidPattern', () => {
  it('shows one solid colour', () => {
    const driver = new CeiledDriver(null, 3);
    const pattern: SolidPattern = new SolidPattern([Color.RED]);
    pattern.show(driver);
    const colors = new Map<number, Color>();
    colors.set(0, Color.RED);
    colors.set(1, Color.RED);
    colors.set(2, Color.RED);
    expect(driver.setColors).toHaveBeenCalledWith(colors);
  });

  it('shows two solid colours', () => {
    const driver = new CeiledDriver(null, 3);
    const pattern: SolidPattern = new SolidPattern([Color.RED, Color.BLUE]);
    pattern.show(driver);
    const colors = new Map<number, Color>();
    colors.set(0, Color.RED);
    colors.set(1, Color.BLUE);
    colors.set(2, Color.RED);
    expect(driver.setColors).toHaveBeenCalledWith(colors);
  });

  it('shows three solid colours', () => {
    const driver = new CeiledDriver(null, 3);
    const pattern: SolidPattern = new SolidPattern([Color.RED, Color.BLUE, Color.GREEN]);
    pattern.show(driver);
    const colors = new Map<number, Color>();
    colors.set(0, Color.RED);
    colors.set(1, Color.BLUE);
    colors.set(2, Color.GREEN);
    expect(driver.setColors).toHaveBeenCalledWith(colors);
  });
});
