import Color from '../../common/Color';
import { PatternType } from '../../patterns/Pattern';
import { AlternatingFadeBuilder } from './alternating-fade';

const colors = [
  Color.ROOMLIGHT,
  Color.RED.blend(Color.ROOMLIGHT),
  Color.YELLOW.blend(Color.ROOMLIGHT),
  Color.LIME.blend(Color.ROOMLIGHT),
  Color.RED.blend(Color.ROOMLIGHT),
];

/**
 * Calm: primarily roomlight, but with nuanced warm colour accents
 */
export const builder = (): AlternatingFadeBuilder => {
  return new AlternatingFadeBuilder().colors(colors).type(PatternType.FadeLinear);
};
