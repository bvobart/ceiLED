import { Driver } from '../hardware/Driver';
import { Service } from './Service';

export class CeiledService implements Service {
  private driver: Driver;

  constructor(driver: Driver) {
    this.driver = driver;
  }

  public getBrightness(): Promise<number> {
    return this.driver.getBrightness();
  }

  public setBrightness(brightness: number): Promise<void> {
    // TODO: input validation
    return this.driver.setBrightness(brightness);
  }

  public getRoomlight(): Promise<number> {
    return this.driver.getRoomlight();
  }

  public setRoomlight(roomlight: number): Promise<void> {
    // TODO: input validation
    return this.driver.setRoomlight(roomlight);
  }

  public getFlux(): Promise<number> {
    return this.driver.getFlux();
  }

  public setFlux(flux: number): Promise<void> {
    // TODO: input validation
    // TODO: auto flux
    return this.driver.setFlux(flux);
  }

  // TODO: setting CeiLED patterns and such
}
