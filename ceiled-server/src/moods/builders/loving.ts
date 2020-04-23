import Color from '../../common/Color';
import { PatternType } from '../../patterns/Pattern';
import { AlternatingFadeBuilder } from './alternating-fade';

const colors = [Color.RED, Color.PINK, Color.PURPLE];

/**
 * Loving: primarily deep red with a bit of purple / pink
 */
export const builder = () => {
  return new AlternatingFadeBuilder().colors(colors).type(PatternType.FADE_LINEAR);
};
