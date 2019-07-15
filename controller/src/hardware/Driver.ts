import Color from '../common/Color';
import { InterpolationType } from '../patterns/options/FadePatternOptions';

/**
 * A class that implements the Driver interface can be used as a driver for this controller.
 */
export interface Driver {
  /**
   * Ghe number of channels on which the device behind this driver can display colour.
   */
  channels: number;

  /**
   * Initialises the connection to the driver. Has to be called before any of the get* or set* methods can be called.
   */

  connect(): Promise<void>;

  /**
   * Closes the connection to the driver.
   */
  close(): void;

  /**
   * Turns the device off, i.e. display all black. The connection to the device should still remain open however.
   */
  off(): Promise<void>;

  /**
   * Gets the colour of the specified channel.
   */
  getColor(channel: number): Promise<Color>;

  /**
   * Sets a colour on the specified channels
   * @param channels the channels should be set to the given colour
   * @param color the colour to set
   */
  setColor(channels: number[], color: Color): Promise<void>;

  /**
   * Sets the specified channels to the specified colours.
   * @param colors mapping of channel numbers to colours
   */
  setColors(colors: Map<number, Color>): Promise<void>;

  /**
   * Sets a fade to a specific colour on the given channels, taking `millis` milliseconds and using the
   * specified interpolation type.
   * @param channels the channels to fade on
   * @param to the colour to fade to
   * @param millis the amount of milliseconds that a fade takes
   * @param interpolation the interpolation type, i.e. linear or sigmoid.
   */
  setFade(
    channels: number[],
    to: Color,
    millis: number,
    interpolation: InterpolationType,
  ): Promise<void>;

  /**
   * Sets the specified channels to fade to their respective colours, taking `millis` milliseconds and using the
   * specified interpolation type.
   * @param colors mapping of channel numbers to colours to fade towards.
   * @param millis the amount of milliseconds that a fade takes
   * @param interpolation the interpolation type, i.e. linear or sigmoid.
   */
  setFades(
    colors: Map<number, Color>,
    millis: number,
    interpolation: InterpolationType,
  ): Promise<void>;
}
