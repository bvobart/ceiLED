import { Driver } from '../hardware/Driver';
import { Animation } from './Animation';
import { fromMood, Moods } from './moods';
import { Pattern, PatternType } from './Pattern';

export class MoodPattern implements Pattern {
  public type: PatternType = PatternType.MOOD;
  public length: number;
  public mood: Moods;

  private animation: Animation;

  constructor(length: number, mood: Moods) {
    this.mood = mood;
    this.length = length;
    this.animation = fromMood(mood);
  }

  public show(channel: number | 'all', driver: Driver, speed: number): Promise<void> {
    const pattern = this.animation.next().value;
    if (pattern) {
      return pattern.show(channel, driver, speed);
    }
    return Promise.reject('mood animation contains no patterns, probably not implemented');
  }
}
