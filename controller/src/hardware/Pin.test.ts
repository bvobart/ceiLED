import { Pca9685Options } from 'pca9685';
import Pin from './Pin';

jest.mock('pca9685', () => {
  return { 
    Pca9685Driver: jest.fn((options: Pca9685Options, callback: (error: any) => any) => {
      callback('MockError');
    })
  };
});

describe('Pin', () => {
  describe('upon static driver initialisation', () => {
    it('switches to debug driver when Pca9685Driver is not available', () => {
      console.log = jest.fn();
      const pin: Pin = new Pin(2);
      pin.value = 65;
      expect(console.log).toHaveBeenCalledWith('[DEBUG] Set pin', 2 , 'to', 65 / 255);
    });
  })
});