import Color from '../common/Color';
import { currentFluxLevel, millisUntilNextFluxChange } from '../common/flux';
import { Driver } from '../hardware/Driver';
import moods, { Moods } from '../moods';
import { Animation } from '../patterns/Animation';
import { Pattern } from '../patterns/Pattern';
import { SolidPattern } from '../patterns/SolidPattern';
import { inRange, range } from '../patterns/utils';
import { AnimationEngine } from './animations/AnimationEngine';
import { CeiledState, DisplayMode } from './CeiledState';
import { Service } from './Service';

/**
 * Defines and implements all functionalities that can be called on ceiled-server thrugh the API.
 */
export class CeiledService implements Service {
  private autoFluxTimeout: NodeJS.Timeout | undefined;
  private animationEngine: AnimationEngine;
  private driver: Driver;

  private state = new CeiledState();

  constructor(driver: Driver) {
    this.driver = driver;
    this.animationEngine = new AnimationEngine(driver);
    void this.initSettings();

    for (const c of range(driver.channels)) {
      this.state.current.patterns.set(c, new SolidPattern(1, Color.random()));
    }
  }

  // --            --
  // ----  Flux  ----
  // --            --

  public async getBrightness(): Promise<number> {
    const brightness = Math.round((await this.driver.getBrightness()) / 2.55);
    this.state.brightness = brightness;
    return brightness;
  }

  public async setBrightness(brightness: number): Promise<void> {
    const newBrightness = inRange(brightness, 0, 100);
    if (this.state.brightness === newBrightness) return Promise.resolve();

    this.state.brightness = newBrightness;
    await this.driver.setBrightness(newBrightness * 2.55);

    // re-apply solid colours, otherwise setting brightness has no effect.
    if (this.state.mode == DisplayMode.Solids) {
      await this.setPatterns(this.state.current.patterns);
    }
  }

  // --            --
  // ----  Flux  ----
  // --            --

  public async getRoomlight(): Promise<number> {
    const roomlight = Math.round((await this.driver.getRoomlight()) / 2.55);
    this.state.roomlight = roomlight;
    return roomlight;
  }

  public async setRoomlight(roomlight: number): Promise<void> {
    const newRoomlight = inRange(roomlight, 0, 100);
    if (this.state.roomlight === newRoomlight) return Promise.resolve();

    this.state.roomlight = newRoomlight;
    await this.driver.setRoomlight(newRoomlight * 2.55);

    // re-apply solid colours, otherwise setting roomlight has no effect.
    if (this.state.mode == DisplayMode.Solids) {
      await this.setPatterns(this.state.current.patterns);
    }
  }

  // --            --
  // ----  Flux  ----
  // --            --

  public async getFlux(): Promise<number> {
    if (this.state.flux === -1) return -1;

    const flux = await this.driver.getFlux();
    this.state.flux = flux;
    return flux;
  }

  public async setFlux(flux: number): Promise<void> {
    const newFlux = inRange(flux, -1, 5);
    if (this.state.flux === newFlux) return Promise.resolve();

    this.state.flux = newFlux;
    if (newFlux === -1) {
      await this.autoUpdateFlux();
    } else {
      this.clearAutoFluxTimer();
      await this.driver.setFlux(newFlux);
    }

    // re-apply solid colours, otherwise setting flux has no effect.
    if (this.state.mode == DisplayMode.Solids) {
      await this.setPatterns(this.state.current.patterns);
    }
  }

  // --           --
  // ----  Off  ----
  // --           --

  public off(): Promise<void> {
    this.state.mode = DisplayMode.Off;
    return this.driver.off();
  }

  // --                --
  // ----  Patterns  ----
  // --                --

  public getPattern(channel: number): Promise<Pattern | undefined> {
    if (this.animationEngine.isRunning()) {
      return Promise.resolve(this.animationEngine.getCurrentPattern(channel));
    }
    return Promise.resolve(this.state.current.patterns.get(channel));
  }

  public getPatterns(): Promise<Map<number, Pattern>> {
    if (this.animationEngine.isRunning()) {
      return Promise.resolve(this.animationEngine.getCurrentPatterns());
    }
    return Promise.resolve(this.state.current.patterns);
  }

  // --              --
  // ----  Solids  ----
  // --              --

  public setPattern(channel: number | 'all', pattern: Pattern): Promise<void> {
    if (channel === 'all') {
      for (const c of range(this.driver.channels)) this.state.current.patterns.set(c, pattern);
    } else {
      this.state.current.patterns.set(channel, pattern);
    }

    this.state.mode = DisplayMode.Solids;
    this.animationEngine.pause();
    return pattern.show(channel, this.driver, this.animationEngine.speed);
  }

  public async setPatterns(patterns: Map<number, Pattern>): Promise<void> {
    const applying = new Array<Promise<void>>();
    for (const [channel, pattern] of patterns) {
      applying.push(pattern.show(channel, this.driver, this.animationEngine.speed));
      this.state.current.patterns.set(channel, pattern);
    }

    this.state.mode = DisplayMode.Solids;
    this.animationEngine.pause();
    await Promise.all(applying);
  }

  // --                  --
  // ----  Animations  ----
  // --                  --

  public setAnimations(animations: Map<number, Animation>): Promise<void> {
    for (const [channel, animation] of animations) {
      if (channel >= this.driver.channels) throw new Error(`invalid channel ${channel}`);
      if (animation.patterns.length < 1)
        throw new Error(`animation for channel ${channel} contains no patterns`);
    }

    this.state.mode = DisplayMode.Animations;
    this.animationEngine.play(animations);
    return Promise.resolve();
  }

  // --             --
  // ----  Moods  ----
  // --             --

  /**
   * Sets a mood, see the `ceiled-server/moods` folder for the configured moods.
   * @param mood the mood to be set
   */
  public setMood(mood: Moods): Promise<void> {
    const animations = moods.builder(mood).channels(this.driver.channels).generate();
    this.state.mode = DisplayMode.Mood;
    this.state.current.mood = mood;
    this.animationEngine.play(animations);
    return Promise.resolve();
  }

  // --                       --
  // ----  Animation speed  ----
  // --                       --

  public getSpeed(): Promise<number> {
    return Promise.resolve(this.animationEngine.speed);
  }

  public setSpeed(speed: number): Promise<void> {
    return this.animationEngine.setSpeed(speed);
  }

  /**
   * Initialises the brightness, roomlight and flux setting values by retrieving them from the driver.
   */
  private async initSettings() {
    await this.driver.getBrightness();
    await this.driver.getRoomlight();
    await this.driver.getFlux();
  }

  // --                 --
  // ----  Auto-flux  ----
  // --                 --

  /**
   * Enables automatic flux setting. Will keep calling itself until `clearAutoFluxTimer` is called.
   */
  private autoUpdateFlux(): Promise<void> {
    this.clearAutoFluxTimer();
    const millis = millisUntilNextFluxChange(new Date());
    this.autoFluxTimeout = setTimeout(this.autoUpdateFlux.bind(this), millis);

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
