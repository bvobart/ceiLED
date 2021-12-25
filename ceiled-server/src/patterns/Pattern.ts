import { Color, IColor } from '../common/Color';
import { Driver } from '../hardware/Driver';
import { FadePattern } from './FadePattern';
import { SolidPattern } from './SolidPattern';

export enum PatternType {
  Mood = 'mood',
  Solid = 'solid',
  FadeLinear = 'fade-linear',
  FadeSigmoid = 'fade-sigmoid',
}

export interface IPattern {
  // discriminator by which the pattern's implementation can be recognised at runtime
  type: PatternType;
  // number of beats that the pattern will be displayed for, if used inside of an animation.
  length: number;
}

export interface Pattern extends IPattern {
  /**
   * Displays the pattern on the specified channel, on the specified driver, at the specified speed.
   * This method should resolve when it has finished applying the colours for one beat of the
   * patterns total length. This method should be called `this.length` amount of times to ensure that
   * the pattern is shown in its entirety.
   * If the pattern does some form of an animation, then `speed` determines how fast the animation
   * will display and should be defined in beats per minute.
   * Thus `60 * 1000 / speed` is the number of milliseconds this pattern will display for.
   */
  show(channel: number | 'all', driver: Driver, speed?: number): Promise<void>;
}

export const isPattern = (x: any): x is IPattern => {
  return Object.values(PatternType).includes(x.type as PatternType) && typeof x.length === 'number';
};

export const isPatternArray = (x: any): x is IPattern[] => {
  return Array.isArray(x) && !x.some(p => !isPattern(p));
};

export const decodePattern = (p: any): Pattern => {
  if (!Object.values(PatternType).includes(p.type as PatternType)) {
    throw new Error(`Invalid pattern type: ${JSON.stringify(p.type)}`);
  }

  if (typeof p.length !== 'number') {
    throw new Error(`Invalid pattern length: not a number: ${JSON.stringify(p.length)}`);
  }

  if (p.type === PatternType.Solid) {
    if (Color.is(p.color)) {
      return new SolidPattern(p.length as number, new Color(p.color as IColor));
    } else {
      throw new Error(`Invalid solid pattern: Invalid color: ${JSON.stringify(p.color)}`);
    }
  }

  if (p.type === PatternType.FadeLinear || p.type === PatternType.FadeSigmoid) {
    if (Color.isList(p.colors)) {
      const colors = p.colors as IColor[];
      return new FadePattern(
        p.type as PatternType.FadeLinear | PatternType.FadeSigmoid,
        p.length as number,
        colors.map((c: IColor) => new Color(c)),
      );
    } else {
      throw new Error(`Invalid fade pattern: invalid colors: ${JSON.stringify(p.colors)}`);
    }
  }

  // TODO: MoodPattern

  throw new Error('invalid pattern: ' + JSON.stringify(p));
};

export const decodePatternMap = (ps: Map<number, IPattern>): Map<number, Pattern> => {
  const patterns = new Map<number, Pattern>();
  for (const [channel, pattern] of ps) {
    try {
      patterns.set(channel, decodePattern(pattern));
    } catch (ex) {
      const err = ex as Error;
      throw new Error(`Invalid pattern for channel ${channel}: ${err.message}`);
    }
  }
  return patterns;
};
