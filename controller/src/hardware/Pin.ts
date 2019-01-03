import { settings } from '../server';

/**
 * Class to represent and control a pin on the Up Squared.
 */
class Pin {
  /** Pin number. */
  public number: number;

  /** Pin value. Can be between 0 and 255 */
  private _value: number; // tslint:disable-line

  constructor(pinNr: number) {
    this.number = pinNr;
  }

  /**
   * Returns the value that the pin is currently at. This value can be between 0 and 255.
   */
  get value(): number {
    return this._value;
  }

  /**
   * Sets the value of a pin, and tells the driver to set it on the actual pin as well.
   */
  set value(newValue: number) {
    if (newValue < 0) newValue = 0;
    if (newValue > 255) newValue = 255;

    newValue = newValue;
    this._value = newValue;
    if (settings && settings.getDriver()) {
      settings.getDriver().setDutyCycle(this.number, Math.round((newValue / 255) * 1000) / 1000);
    }
  }
}

export default Pin;
