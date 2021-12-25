import { decodePattern, IPattern, Pattern } from './Pattern';

export class Animation implements IterableIterator<Pattern> {
  patterns: Pattern[];

  private currentIndex = 0;
  private repeat = 0;

  constructor(patterns: Pattern[]) {
    this.patterns = patterns;
  }

  clone(): Animation {
    return new Animation(this.patterns.map(p => Object.create(p) as Pattern)); // eslint-disable-line @typescript-eslint/no-unsafe-return
  }

  next(): IteratorResult<Pattern, null> {
    if (!this.patterns || this.patterns.length === 0) return { done: true, value: null };

    const pattern = this.patterns[this.currentIndex % this.patterns.length];
    if (this.repeat > 0) {
      this.repeat--;
      if (this.repeat === 0) this.currentIndex++;
      return { done: false, value: pattern };
    }

    if (pattern.length > 1) {
      this.repeat = pattern.length - 1;
      return { done: false, value: pattern };
    }

    this.currentIndex++;
    return { done: false, value: pattern };
  }

  // makes it possible to use in for loops
  [Symbol.iterator](): IterableIterator<Pattern> {
    return this;
  }
}

export const decodeAnimation = (ps: IPattern[]): Animation => {
  return new Animation(ps.map(decodePattern));
};

export const decodeAnimationMap = (anims: Map<number, IPattern[]>): Map<number, Animation> => {
  const animations = new Map<number, Animation>();
  for (const [channel, patterns] of anims) {
    animations.set(channel, decodeAnimation(patterns));
  }
  return animations;
};
