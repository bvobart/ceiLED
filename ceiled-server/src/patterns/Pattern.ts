import { Driver } from '../hardware/Driver';

export enum PatternType {
  MOOD = 'mood',
  SOLID = 'solid',
  FADE_LINEAR = 'fade-linear',
  FADE_SIGMOID = 'fade-sigmoid',
}

export interface Pattern {
  // discriminator by which the pattern's implementation can be recognised at runtime
  type: PatternType;

  // number of beats that the pattern will be displayed for, if used inside of an animation.
  length: number;

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

export const isPattern = (x: any): x is Pattern => {
  return Object.values(PatternType).includes(x.type) && typeof x.length === 'number';
};

export const isPatternArray = (x: any): x is Pattern[] => {
  if (Array.isArray(x)) {
    return !x.some(p => !isPattern(p));
  }
  return false;
};
