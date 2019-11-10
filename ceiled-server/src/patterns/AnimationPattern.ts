import Color from '../common/Color';
import { Transition } from '../common/Transition';
import { Driver } from '../hardware/Driver';
import Pattern from './Pattern';

export class AnimationPattern implements Pattern {
  public variant: 'solid' = 'solid';
  public path: Array<Color | Transition>;

  public show(channel: number | 'all', driver: Driver): Promise<void> {
    // TODO: show pattern
    return Promise.reject('not yet implemented');
  }

  public stop(): void {
    // TODO: stop showing pattern
  }
}
