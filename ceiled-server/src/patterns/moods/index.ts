import { Animation } from '../Animation';
import calm from './calm';
import cool from './cool';
import loving from './loving';
import productive from './productive';
import rainbow from './rainbow';
import warm from './warm';

export { calm, cool, loving, productive, rainbow, warm };

export enum Moods {
  CALM = 'calm',
  COOL = 'cool',
  PRODUCTIVE = 'productive',
  WARM = 'warm',
  LOVING = 'loving',
  RAINBOW = 'rainbow',
}

export const fromMood = (type: Moods): Animation => {
  switch (type) {
    case Moods.CALM:
      return calm;
    case Moods.COOL:
      return cool;
    case Moods.PRODUCTIVE:
      return productive;
    case Moods.WARM:
      return warm;
    case Moods.LOVING:
      return loving;
    case Moods.RAINBOW:
      return rainbow;
    // ensures compiler type error when switch is not exhaustive.
    default:
      return unreachable(type);
  }
};

const unreachable = (x: never): never => {
  throw new Error('this is unreachable');
};
