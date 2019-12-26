import { Driver } from '../hardware/Driver';
import { Pattern, PatternType } from './Pattern';

export class MoodPattern implements Pattern {
  public type: PatternType = PatternType.MOOD;
  public length: number;
  public mood: string;

  constructor(length: number, mood: string) {
    this.mood = mood;
    this.length = length;
  }

  public show(channel: number | 'all', driver: Driver): Promise<void> {
    // TODO: show pattern
    return Promise.reject('not yet implemented');
  }

  public stop(): void {
    // TODO: stop pattern
  }
}
