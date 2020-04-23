import Color from '../../common/Color';
import { PatternType } from '../../patterns/Pattern';
import { AlternatingFadeBuilder } from './alternating-fade';

const colors = [Color.RED, Color.ORANGE, Color.YELLOW, Color.ORANGE];

/**
 * Warm: primarily orange (bit warmer than roomlight) with some red and yellow tones
 */
export const builder = () => {
  return new AlternatingFadeBuilder().colors(colors).type(PatternType.FADE_LINEAR);
};
