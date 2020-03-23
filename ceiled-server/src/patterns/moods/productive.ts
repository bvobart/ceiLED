import Color from '../../common/Color';
import { Animation } from '../Animation';
import { FadePattern } from '../FadePattern';
import { PatternType } from '../Pattern';

/**
 * Productive: primarily light blue and some greenish tones to keep you awake.
 */
export default new Animation([
  new FadePattern(PatternType.FADE_LINEAR, 3, [
    Color.LIGHTBLUE.blend(Color.ROOMLIGHT),
    Color.LIME.blend(Color.ROOMLIGHT),
    Color.TURQUOISE.blend(Color.ROOMLIGHT),
  ]),
]);
