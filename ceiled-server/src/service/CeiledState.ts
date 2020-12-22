import { Moods } from '../moods';
import { Animation } from '../patterns/Animation';
import { Pattern } from '../patterns/Pattern';

export const enum DisplayMode {
  Off,
  Solids,
  Animations,
  Mood,
}

export class CeiledState {
  brightness = 100;
  roomlight = 0;
  flux = -1;

  /**
   * The current display mode.
   * When this is DisplayMode.Solids, then current.patterns will be what is currently being displayed.
   * When this is DisplayMode.Animations, then current.animations will be what is currently being displayed.
   * When this is DisplayMode.Mood, then current.Mood will be the current mood.
   */
  mode = DisplayMode.Off;

  /**
   * The current thing being displayed, or the last set value for that thing.
   * The thing that is actually currently being displayed depends on the current DisplayMode.
   */
  current = {
    patterns: new Map<number, Pattern>(),
    animations: new Map<number, Animation>(),
    mood: Moods.WARM,
  };
}
