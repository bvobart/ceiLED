import Color from '../../common/Color';
import { Animation } from '../Animation';
import { FadePattern } from '../FadePattern';
import { PatternType } from '../Pattern';

/**
 * Rainbow: all the colours of the rainbow, in that order :)
 */
export default new Animation([
  new FadePattern(PatternType.FADE_LINEAR, 8, [
    Color.RED,
    Color.ORANGE,
    Color.YELLOW,
    Color.GREEN,
    Color.LIGHTBLUE,
    Color.BLUE,
    Color.PURPLE,
    Color.PINK,
  ]),
]);
