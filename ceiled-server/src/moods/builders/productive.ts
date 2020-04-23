import Color from '../../common/Color';
import { PatternType } from '../../patterns/Pattern';
import { AlternatingFadeBuilder } from './alternating-fade';

const colors = [
  Color.LIGHTBLUE.blend(Color.ROOMLIGHT),
  Color.LIME.blend(Color.ROOMLIGHT),
  Color.TURQUOISE.blend(Color.ROOMLIGHT),
];

/**
 * Productive: primarily light blue and some greenish tones to keep you awake.
 */
export const builder = () => {
  return new AlternatingFadeBuilder().colors(colors).type(PatternType.FADE_SIGMOID);
};
