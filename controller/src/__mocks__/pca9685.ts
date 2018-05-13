import Pca9685Options from 'pca9685';

export default {
  Pca9685Driver: jest.fn((options: Pca9685Options, callback: (error: any) => any) => {
    callback('MockError');
  })
}