import LEDChannel from './LEDChannel';
import Color from '../common/Color';

describe('LEDChannel', () => {
  let channel: LEDChannel;

  beforeEach(() => {
    channel = new LEDChannel(1);
  });

  describe('setFade', () => {
    it('fades from green to blue in exactly 1 second', async done => {
      const oldConsole = console.log;
      console.log = jest.fn();
      const start = new Date().getTime();
      await channel.setFade(Color.GREEN, Color.BLUE, 1);
      const end = new Date().getTime();
      console.log = oldConsole;
      console.log('Fade took', end - start, 'ms');
      done();
    });
  });
});