import { currentFluxLevel, millisUntilNextFluxChange } from '../common/flux';
import { Driver } from '../hardware/Driver';
import { Service } from './Service';

/**
 * Defines and implements all functionalities that can be called on ceiled-server thrugh the API.
 * TODO: reapply any active solid patterns upon changing brightness, roomlight or flux. Not necessary for fades.
 */
export class CeiledService implements Service {
  private driver: Driver;

  private brightness: number;
  private roomlight: number;
  private flux: number;
  private autoFluxTimeout: NodeJS.Timeout;

  constructor(driver: Driver) {
    this.driver = driver;
    this.initSettings();
  }

  public async getBrightness(): Promise<number> {
    const brightness = (await this.driver.getBrightness()) / 2.55;
    this.brightness = brightness;
    return brightness;
  }

  public setBrightness(brightness: number): Promise<void> {
    const newBrightness = inRange(brightness, 0, 100);

    if (this.brightness !== newBrightness) {
      this.brightness = newBrightness;
      return this.driver.setBrightness(newBrightness * 2.55);
    }
  }

  public async getRoomlight(): Promise<number> {
    const roomlight = (await this.driver.getRoomlight()) / 2.55;
    this.roomlight = roomlight;
    return roomlight;
  }

  public setRoomlight(roomlight: number): Promise<void> {
    const newRoomlight = inRange(roomlight, 0, 100);

    if (this.roomlight !== newRoomlight) {
      this.roomlight = newRoomlight;
      return this.driver.setRoomlight(newRoomlight * 2.55);
    }
  }

  public async getFlux(): Promise<number> {
    if (this.flux === -1) {
      return -1;
    }
    const flux = await this.driver.getFlux();
    this.flux = flux;
    return flux;
  }

  public setFlux(flux: number): Promise<void> {
    const newFlux = inRange(flux, -1, 5);

    if (this.flux !== newFlux) {
      if (newFlux === -1) {
        return this.autoUpdateFlux();
      } else {
        this.clearAutoFluxTimer();
        this.flux = newFlux;
        return this.driver.setFlux(newFlux);
      }
    }
  }

  // TODO: setting CeiLED patterns and such

  private async initSettings() {
    await this.driver.getBrightness();
    await this.driver.getRoomlight();
    await this.driver.getFlux();
  }

  private autoUpdateFlux(): Promise<void> {
    this.clearAutoFluxTimer();
    const millis = millisUntilNextFluxChange(new Date());
    this.autoFluxTimeout = setTimeout(this.autoUpdateFlux, millis);

    const newFlux = currentFluxLevel(new Date());
    this.flux = newFlux;
    return this.driver.setFlux(newFlux);
  }

  private clearAutoFluxTimer(): void {
    if (this.autoFluxTimeout) {
      clearTimeout(this.autoFluxTimeout);
      this.autoFluxTimeout = undefined;
    }
  }
}

/**
 * Ensures that a certain number value is within a certain range.
 * @param value the value
 * @param min minimum of the range
 * @param max maximum of the range.
 */
const inRange = (value: number, min: number, max: number): number => {
  return value < min ? min : value > max ? max : value;
};
