import { Pca9685Options } from 'pca9685';
import Pin from './Pin';


describe('Pin', () => {
  describe('upon static driver initialisation', () => {
    it('switches to debug driver when Pca9685Driver is not available', () => {
      console.log = jest.fn();
      const pin: Pin = new Pin(2);
      pin.value = 65;
      expect(console.log).toHaveBeenCalled();
    });
  })
});