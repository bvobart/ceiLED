import React, { FunctionComponent } from 'react';
import { Moods } from '../../api/moods';
import { FadeTile } from './patterns';
import { FadePattern, PatternType } from '../../api/patterns';
import { RGBColor } from '../color-picking/colors';

export interface MoodTileProps {
  mood: Moods;
}

export const MoodTile: FunctionComponent<MoodTileProps> = props => {
  const { children, mood } = props;
  const colors = getColors(mood);
  const pattern = new FadePattern(PatternType.FADE_LINEAR, 2, colors);
  return (
    <FadeTile pattern={pattern} direction='to right'>
      {children}
    </FadeTile>
  );
};

const getColors = (mood: Moods): RGBColor[] => {
  switch (mood) {
    case Moods.CALM:
      return [RGBColor.ROOMLIGHT, RGBColor.ORANGE];
    case Moods.COOL:
      return [RGBColor.TURQUOISE, RGBColor.BLUE, RGBColor.PURPLE, RGBColor.PINK];
    case Moods.PRODUCTIVE:
      return [RGBColor.LIGHTBLUE, RGBColor.LIME, RGBColor.TURQUOISE];
    case Moods.WARM:
      return [RGBColor.ORANGE, RGBColor.RED, RGBColor.ORANGE];
    case Moods.LOVING:
      return [RGBColor.RED, RGBColor.PINK, RGBColor.PURPLE];
    case Moods.RAINBOW:
      return [RGBColor.RED, RGBColor.YELLOW, RGBColor.GREEN, RGBColor.BLUE, RGBColor.PURPLE, RGBColor.PINK];
    // ensures compiler type error when switch is not exhaustive.
    default:
      return unreachable(mood);
  }
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const unreachable = (x: never): never => {
  throw new Error('this is unreachable');
};
