import { currentFluxLevel, millisUntilNextFluxChange } from '../common/flux';
import { Driver } from '../hardware/Driver';
import { Animation } from '../patterns/Animation';
import { Pattern } from '../patterns/Pattern';
import { AnimationEngine } from './AnimationEngine';
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
  private currentPatterns: Map<number, Pattern>;
  private animationEngine: AnimationEngine;

  constructor(driver: Driver) {
    this.driver = driver;
    this.initSettings();
  }

  public async getBrightness(): Promise<number> {
    const brightness = Math.round((await this.driver.getBrightness()) / 2.55);
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
    const roomlight = Math.round((await this.driver.getRoomlight()) / 2.55);
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
      this.flux = newFlux;
      if (newFlux === -1) {
        return this.autoUpdateFlux();
      } else {
        this.clearAutoFluxTimer();
        return this.driver.setFlux(newFlux);
      }
    }
  }

  public off(): Promise<void> {
    return this.driver.off();
  }

  public getPattern(channel: number): Promise<Pattern> {
    return Promise.resolve(this.currentPatterns.get(channel));
  }

  public async setPattern(channel: number | 'all', pattern: Pattern): Promise<void> {
    await pattern.show(channel, this.driver, this.animationEngine.speed);
    if (channel === 'all') {
      for (const c of range(this.driver.channels)) this.currentPatterns.set(c, pattern);
    } else {
      this.currentPatterns.set(channel, pattern);
    }
  }

  public async setPatterns(patterns: Map<number, Pattern>): Promise<void> {
    const applying = new Array<Promise<void>>();
    for (const [channel, pattern] of patterns) {
      applying.push(pattern.show(channel, this.driver, this.animationEngine.speed));
      this.currentPatterns.set(channel, pattern);
    }

    await Promise.all(applying);
  }

  public async setAnimations(animations: Map<number, Animation>): Promise<void> {
    for (const [channel, animation] of animations) {
      if (channel >= this.driver.channels) throw new Error(`invalid channel ${channel}`);
      if (animation.patterns.length < 1)
        throw new Error(`animation for channel ${channel} contains no patterns`);
    }

    this.animationEngine.play(animations);
  }

  /**
   * Initialises the brightness, roomlight and flux setting values by retrieving them from the driver.
   */
  private async initSettings() {
    await this.driver.getBrightness();
    await this.driver.getRoomlight();
    await this.driver.getFlux();
  }

  /**
   * Enables automatic flux setting. Will keep calling itself until `clearAutoFluxTimer` is called.
   */
  private autoUpdateFlux(): Promise<void> {
    this.clearAutoFluxTimer();
    const millis = millisUntilNextFluxChange(new Date());
    this.autoFluxTimeout = setTimeout(this.autoUpdateFlux, millis);

    const newFlux = currentFluxLevel(new Date());
    return this.driver.setFlux(newFlux);
  }

  /**
   * Disables automatic flux updates.
   */
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

/**
 * Creates an array containing all elements from 0 up to (but not including) `n`
 * @param n the capacity of the resulting array.
 */
const range = (n: number): number[] => Array.from({ length: n }, (_, key) => key);
