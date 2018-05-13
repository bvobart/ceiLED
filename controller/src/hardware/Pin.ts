import { openSync } from 'i2c-bus';
import { Pca9685Driver, Pca9685Options } from 'pca9685';
import DebugDriver from './DebugDriver';

/**
 * Class to represent and control a pin on the Up Squared.
 * It is statically initialised with the pin driver, which the Pin objects can then
 * make use of in order to actually drive their pin.
 */
class Pin {
  /**
   * Statically initialises the driver for the PCA9685 chip that controls the LED pins.
   */
  public static initializeDriver() {
    const options: Pca9685Options = {
      i2c: openSync(5),
      address: 0x40,
      frequency: 1000,
      debug: false
    };
    try {
      Pin.driver = new Pca9685Driver(options, (error: any) => {
        if (error) {
          console.error("Error initialising driver!");
          console.error(error);
          throw error;
        }
      });
    } catch (error) {
      console.warn(".--------------------------.");
      console.warn("|-------- WARNING! --------|");
      console.warn("|--------------------------|");
      console.warn("|- Now using debug driver -|");
      console.warn("|- No actual LEDs will be -|");
      console.warn("|------- controlled -------|");
      console.warn("'--------------------------'");
      this.driver = new DebugDriver();
    }
  }

  /**
   * Sets a new driver for the pins. Allows drivers to be swapped in for testing.
   * @param driver The driver to be set.
   */
  public static setDriver(driver: Pca9685Driver | DebugDriver) {
    console.warn(".--------------------------.")
    console.warn("|-------- WARNING! --------|");
    console.warn("|-----       -        -----|");
    console.warn("|--- Pin driver changed ---|");
    console.warn("'------------ -------------'");
    Pin.driver = driver;
  }

  private static driver: Pca9685Driver | DebugDriver;

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
    Pin.driver.setDutyCycle(this.number, Math.round((newValue / 255) * 1000) / 1000);
  }
}

Pin.initializeDriver();

export default Pin;