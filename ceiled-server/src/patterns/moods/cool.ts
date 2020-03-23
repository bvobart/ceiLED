import Color from '../../common/Color';
import { Animation } from '../Animation';
import { FadePattern } from '../FadePattern';
import { PatternType } from '../Pattern';

/**
 * Cool: primarily blue, some purple / pink and turquoise tones
 */
export default new Animation([
  new FadePattern(PatternType.FADE_LINEAR, 5, [
    Color.TURQUOISE.blend(Color.ROOMLIGHT),
    Color.LIGHTBLUE.blend(Color.ROOMLIGHT),
    Color.BLUE.blend(Color.ROOMLIGHT),
    Color.PURPLE.blend(Color.ROOMLIGHT),
    Color.PINK.blend(Color.ROOMLIGHT),
  ]),
]);
