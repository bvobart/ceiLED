import Color from '../common/Color';
import { InterpolationType } from './interpolate';

/**
 * A class that implements the Driver interface can be used as a driver for this controller.
 */
export interface Driver {
  /**
   * The number of channels on which the device behind this driver can display colour.
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
   * Sets the specified channels to the specified colours.
   * @param colors mapping of channel numbers to colours
   */
  setColors(colors: Map<number, Color>): Promise<void>;

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

  /**
   * Sets the brightness level. Must be a number between 0 and 255
   */
  setBrightness(brightness: number): Promise<void>;

  /**
   * Gets the brightness level.
   */
  getBrightness(): Promise<number>;

  /**
   * Sets the level of roomlight adjustment. Must be a number between 0 and 255
   * @param roomlight the roomlight level to be set. Between 0 and 255
   */
  setRoomlight(roomlight: number): Promise<void>;

  /**
   * Gets the roomlight level adjustment.
   */
  getRoomlight(): Promise<number>;

  /**
   * Sets the flux level (blue light reduction)
   * @param flux flux level. Between 0 and 5 inclusive
   */
  setFlux(flux: number): Promise<void>;

  /**
   * Gets the flux level (blue light reduction)
   */
  getFlux(): Promise<number>;
}
