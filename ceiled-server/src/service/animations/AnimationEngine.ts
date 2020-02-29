import { Driver } from '../../hardware/Driver';
import { Animation } from '../../patterns/Animation';
import { Pattern } from '../../patterns/Pattern';
import { BufferDriver } from './BufferDriver';

export class AnimationEngine {
  public speed: number = 30; // bpm
  public onError: (error: Error) => void;

  private driver: BufferDriver;

  private animations: Map<number, Animation> = new Map();
  private activePatterns: Map<number, Pattern> = new Map();
  private running: boolean = false;
  private timeout: NodeJS.Timeout;

  constructor(driver: Driver) {
    this.driver = new BufferDriver(driver);
  }

  public isRunning(): boolean {
    return this.running;
  }

  public getCurrentPattern(channel: number): Pattern | undefined {
    return this.activePatterns.get(channel);
  }

  public getCurrentPatterns(): Map<number, Pattern> {
    return this.activePatterns;
  }

  public play(animations: Map<number, Animation>): void {
    this.animations = animations;
    this.activePatterns = new Map();
    this.running = true;
    this.run().catch(this.onError);
  }

  public pause(): void {
    this.running = false;
    clearTimeout(this.timeout);
  }

  public continue(): void {
    this.running = true;
    this.run().catch(this.onError);
  }

  private async run(): Promise<void> {
    if (!this.running) return;

    const startTime = process.hrtime();
    await this.playNextBeat();
    const endTime = process.hrtime(startTime);
    const execTime = endTime[0] * 1000 + endTime[1] / 1000000;

    const millis = (60 * 1000) / this.speed - execTime;
    this.timeout = setTimeout(this.run.bind(this), Math.max(millis, 0));
  }

  private async playNextBeat(): Promise<void> {
    const promises = new Array<Promise<void>>();

    for (const [channel, animation] of this.animations) {
      const pattern = animation.next().value;
      if (pattern) {
        promises.push(pattern.show(channel, this.driver, this.speed));
      }
    }

    await Promise.all(promises);
    this.driver.flush();
  }
}
