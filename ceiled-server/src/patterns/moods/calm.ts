import Color from '../../common/Color';
import { Animation } from '../Animation';
import { FadePattern } from '../FadePattern';
import { PatternType } from '../Pattern';

/**
 * Calm: primarily roomlight, but with nuanced warm colour accents
 */
export default new Animation([
  new FadePattern(PatternType.FADE_LINEAR, 5, [
    Color.ROOMLIGHT,
    Color.RED.blend(Color.ROOMLIGHT),
    Color.YELLOW.blend(Color.ROOMLIGHT),
    Color.LIME.blend(Color.ROOMLIGHT),
    Color.RED.blend(Color.ROOMLIGHT),
  ]),
]);
