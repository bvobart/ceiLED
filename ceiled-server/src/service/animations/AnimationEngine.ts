import { Driver } from '../../hardware/Driver';
import { Animation } from '../../patterns/Animation';
import { Pattern } from '../../patterns/Pattern';
import { BufferDriver } from './BufferDriver';

export class AnimationEngine {
  speed = 30; // bpm
  onError = (error: Error): void => {
    console.error('!-> Error: AnimationEngine:', error);
  };

  private driver: BufferDriver;

  private animations = new Map<number, Animation>();
  private activePatterns = new Map<number, Pattern>();
  private running = false;
  private timeout?: NodeJS.Timeout;

  constructor(driver: Driver) {
    this.driver = new BufferDriver(driver);
  }

  isRunning(): boolean {
    return this.running;
  }

  getCurrentPattern(channel: number): Pattern | undefined {
    return this.activePatterns.get(channel);
  }

  getCurrentPatterns(): Map<number, Pattern> {
    return this.activePatterns;
  }

  async setSpeed(speed: number): Promise<void> {
    if (speed <= 0) return Promise.reject('speed must be more than 0 bpm');
    this.speed = speed;
  }

  play(animations: Map<number, Animation>): void {
    this.pause();
    this.animations = animations;
    this.activePatterns = new Map<number, Pattern>(); // TODO: activePatterns is not being used.
    this.continue();
  }

  pause(): void {
    this.running = false;
    this.timeout && clearTimeout(this.timeout);
  }

  continue(): void {
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
    this.timeout = setTimeout(() => {
      this.run().catch(err => console.error('Error in AnimationEngine.run():', err));
    }, Math.max(millis, 0));
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
    void this.driver.flush();
  }
}
