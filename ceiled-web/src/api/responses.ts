import { IPattern, isPattern, isPatternArray } from "./patterns";

export class PatternResponse {
  channel: number;
  pattern: IPattern;

  constructor(channel: number, pattern: IPattern) {
    this.channel = channel;
    this.pattern = pattern;
  }

  static is(res: any): res is PatternResponse {
    return typeof res.channel === 'number' && isPattern(res.pattern);
  }
}

export class PatternsResponse {
  patterns: Array<[number, IPattern]>;

  constructor(patterns: Array<[number, IPattern]>) {
    this.patterns = patterns;
  }

  static is(res: any): res is PatternsResponse {
    return Array.isArray(res.patterns) && !res.patterns.some(([channel, pattern]: [any, any]) => {
      return typeof channel !== 'number' || !isPattern(pattern);
    });
  }
}

export class AnimationsResponse {
  animations: Array<[number, IPattern[]]>;

  constructor(animations: Array<[number, IPattern[]]>) {
    this.animations = animations;
  }

  static is(res: any): res is AnimationsResponse {
    return Array.isArray(res.animations) && !res.animations.some(([channel, anim]: [any, any]) => {
      return typeof channel !== 'number' || !isPatternArray(anim);
    });
  }
}
