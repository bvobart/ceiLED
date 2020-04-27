import { Animation } from '../patterns/Animation';
import { builder as CalmBuilder } from './builders/calm';
import { builder as CoolBuilder } from './builders/cool';
import { builder as LovingBuilder } from './builders/loving';
import { builder as ProductiveBuilder } from './builders/productive';
import { builder as RainbowBuilder } from './builders/rainbow';
import { builder as WarmBuilder } from './builders/warm';

// usage:
// const animations = moods.builder(Mood.CALM).channels(3).generate()
// this.animationEngine.play(animations);

export enum Moods {
  CALM = 'calm',
  COOL = 'cool',
  PRODUCTIVE = 'productive',
  WARM = 'warm',
  LOVING = 'loving',
  RAINBOW = 'rainbow',
}

const moods = {
  builder(mood: Moods): MoodBuilder {
    switch (mood) {
      case Moods.CALM:
        return CalmBuilder();
      case Moods.COOL:
        return CoolBuilder();
      case Moods.PRODUCTIVE:
        return ProductiveBuilder();
      case Moods.WARM:
        return WarmBuilder();
      case Moods.LOVING:
        return LovingBuilder();
      case Moods.RAINBOW:
        return RainbowBuilder();

      // ensures compiler type error when switch is not exhaustive.
      default:
        return unreachable(mood);
    }
  },
};

const unreachable = (x: never): never => {
  throw new Error('this is unreachable');
};

export default moods;

export interface MoodBuilder {
  channels(channels: number): MoodBuilder;
  generate(): Map<number, Animation>;
}
