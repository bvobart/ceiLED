import Color from '../common/Color';
import { CeiledDriver } from './CeiledDriver';

const socketFile = '../ceiled-driver/ceiled.sock';

describe('ceiled-driver', () => {
  describe('initialisation', () => {
    it.skip('constructs, starts and closes a connection properly', async done => {
      const driver = new CeiledDriver(socketFile, 3);
      const mockLog = jest.fn();
      const defaultLog = console.log;
      console.log = mockLog;
      await driver.connect();
      expect(mockLog).toHaveBeenCalledWith('ceiled-driver connected');
      driver.close();
      console.log = defaultLog;
      done();
    });

    it('fails with error when connect fails', () => {
      const driver = new CeiledDriver('does-not-exist', 3);
      expect(driver.connect()).rejects.toBeDefined();
    });
  });

  describe('getting and setting colors', () => {
    const driver = new CeiledDriver(socketFile, 3);

    beforeEach(async done => {
      await driver.connect();
      done();
    });
    afterEach(() => driver.close());

    it.skip('turns off', async done => {
      driver.off();
      done();
    });

    it.skip('sets a color', async done => {
      const colors = new Map<number, Color>();
      colors.set(0, Color.PURPLE);
      colors.set(1, Color.PURPLE);
      colors.set(2, Color.PURPLE);
      await driver.setColors(colors);
      done();
    });

    it.skip('sets a fade', async done => {
      const colors = new Map<number, Color>();
      colors.set(0, Color.GREEN);
      colors.set(1, Color.GREEN);
      colors.set(2, Color.GREEN);
      await driver.setFades(colors, 3000);
      done();
    });
  });
});
