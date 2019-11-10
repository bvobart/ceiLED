import { Driver } from '../hardware/Driver';
import Pattern from './Pattern';

export class MoodPattern implements Pattern {
  public variant: 'mood' = 'mood';
  public mood: string;

  public show(channel: number | 'all', driver: Driver): Promise<void> {
    // TODO: show pattern
    return Promise.reject('not yet implemented');
  }

  public stop(): void {
    // TODO: stop pattern
  }
}
