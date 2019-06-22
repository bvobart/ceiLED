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

    it.skip('gets a color', async done => {
      expect(await driver.getColor()).toBeInstanceOf(Color);
      done();
    });

    it.skip('turns off', async done => {
      driver.off();
      expect(await driver.getColor()).toEqual(Color.BLACK);
      done();
    });

    it.skip('sets a color', async done => {
      await driver.setColor([0, 1, 2], Color.PURPLE);
      done();
    });

    it.skip('sets a fade', async done => {
      await driver.setFade([0, 1, 2], Color.GREEN, 3000);
      done();
    });
  });
});
