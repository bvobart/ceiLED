import Color from '../../common/Color';
import { PatternType } from '../../patterns/Pattern';
import { AlternatingFadeBuilder } from './alternating-fade';

const colors = [
  Color.TURQUOISE.blend(Color.ROOMLIGHT),
  Color.LIGHTBLUE.blend(Color.ROOMLIGHT),
  Color.BLUE.blend(Color.ROOMLIGHT),
  Color.PURPLE.blend(Color.ROOMLIGHT),
  Color.PINK.blend(Color.ROOMLIGHT),
];

/**
 * Cool: primarily blue, some purple / pink and turquoise tones
 */
export const builder = (): AlternatingFadeBuilder => {
  return new AlternatingFadeBuilder().colors(colors).type(PatternType.FadeLinear);
};
