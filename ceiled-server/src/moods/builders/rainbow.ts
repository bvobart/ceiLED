import Color from '../../common/Color';
import { PatternType } from '../../patterns/Pattern';
import { AlternatingFadeBuilder } from './alternating-fade';

const colors = [
  Color.RED,
  Color.ORANGE,
  Color.YELLOW,
  Color.GREEN,
  Color.LIGHTBLUE,
  Color.BLUE,
  Color.PURPLE,
  Color.PINK,
];

/**
 * Rainbow: all the colours of the rainbow, in that order :)
 */
export const builder = () => {
  return new AlternatingFadeBuilder().colors(colors).type(PatternType.FADE_SIGMOID);
};
