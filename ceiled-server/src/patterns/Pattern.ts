import Color from '../common/Color';
import { Driver } from '../hardware/Driver';
import { FadePattern } from './FadePattern';
import { SolidPattern } from './SolidPattern';

export enum PatternType {
  MOOD = 'mood',
  SOLID = 'solid',
  FADE_LINEAR = 'fade-linear',
  FADE_SIGMOID = 'fade-sigmoid',
}

export interface IPattern {
  // discriminator by which the pattern's implementation can be recognised at runtime
  type: PatternType;
  // number of beats that the pattern will be displayed for, if used inside of an animation.
  length: number;
}

export interface Pattern extends IPattern {
  /**
   * Displays the pattern on the specified channel on the specified driver. Should never block.
   * If the pattern does some form of an animation, then `speed` determines how fast the animation
   * will display and should be defined in beats per minute.
   * Thus `speed * 60 * 1000 * this.length` is the number of milliseconds this pattern will display for.
   */
  show(channel: number | 'all', driver: Driver, speed?: number): Promise<void>;

  /**
   * Stops displaying the pattern. Should never block.
   */
  stop(): void;
}

export const isPattern = (x: any): x is IPattern => {
  return Object.values(PatternType).includes(x.type) && typeof x.length === 'number';
};

export const isPatternArray = (x: any): x is IPattern[] => {
  return Array.isArray(x) && !x.some(p => !isPattern(p));
};

export const decodePattern = (pattern: IPattern): Pattern => {
  const p = pattern as any;

  if (pattern.type === PatternType.SOLID && Color.is(p.color)) {
    return new SolidPattern(pattern.length, p.color);
  }

  if (
    (pattern.type === PatternType.FADE_LINEAR || pattern.type === PatternType.FADE_SIGMOID) &&
    Color.isList(p.colors)
  ) {
    return new FadePattern(pattern.type, pattern.length, p.colors);
  }

  // TODO: MoodPattern

  throw new Error('invalid pattern: ' + JSON.stringify(pattern));
};

export const decodePatternMap = (ps: Map<number, IPattern>): Map<number, Pattern> => {
  const patterns = new Map<number, Pattern>();
  for (const [channel, pattern] of ps) {
    patterns.set(channel, decodePattern(pattern));
  }
  return patterns;
};
