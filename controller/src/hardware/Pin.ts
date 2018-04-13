import { ChildProcess, spawn, spawnSync } from 'child_process';

/**
 * Class to represent and control a pin on the Up Squared.
 * It is statically initialised with the Python driver process, which the Pin objects can then
 * make use of in order to actually drive the pin.
 */
class Pin {
  /**
   * Statically initialises the driver and attaches functions to its output.
   */
  public static initializeDriver() {
    this.driver = spawn('sudo', ['python', '-u', 'scripts/driver.py']);
    this.driver.stdout.on('data', (data: string | Buffer): void => {
      const message: string = data.toString();
      console.log('LED Driver:', message); // TODO: handle this message, signifies incorrect command or pin nr.
    });
    this.driver.stderr.on('data', (data: string | Buffer): void => {
      console.log(data.toString());
    })
    this.driver.on('close', (code, signal) => {
      console.error('LED Driver exited with code', code, 'and signal', signal);
    });
  }

  private static driver: ChildProcess;

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
    this._value = newValue;
    Pin.driver.stdin.write(`${this.number} ${this._value}\n`);
  }
}

Pin.initializeDriver();

export default Pin;