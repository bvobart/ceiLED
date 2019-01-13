import chalk from 'chalk';
import { cursorTo } from 'readline';

/**
 * Mock driver purely for debugging purposes. Is used when no other driver can be used.
 */
class DebugDriver {
  private pinValues: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0];

  public setDutyCycle(pinNr: number, dutyCycle: number) {
    if (pinNr < 0 || pinNr >= this.pinValues.length)
      throw new Error('Invalid pin number! ' + pinNr);
    this.pinValues[pinNr] = Math.round(dutyCycle * 255);
    if (!process.env.TEST) this.prettyPrintValues();
  }

  public prettyPrintValues() {
    const ch1: string = chalk.bgRgb(this.pinValues[0], this.pinValues[1], this.pinValues[2])(
      '[DEBUG] Channel 1',
    );
    const ch2: string = chalk.bgRgb(this.pinValues[3], this.pinValues[4], this.pinValues[5])(
      '[DEBUG] Channel 2',
    );
    const ch3: string = chalk.bgRgb(this.pinValues[6], this.pinValues[7], this.pinValues[8])(
      '[DEBUG] Channel 3',
    );

    cursorTo(process.stdout, 0, process.stdout.rows - 2);
    console.log(`${ch1}${ch2}${ch3}`);
  }
}

export default DebugDriver;
