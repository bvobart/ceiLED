import { Moods } from '../../moods';
import { IPattern, isPattern, isPatternArray } from '../../patterns/Pattern';
import { AuthorisedRequest } from './common';

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

export class OffRequest implements AuthorisedRequest {
  public static is(x: any): x is OffRequest {
    return x.action === 'off' && AuthorisedRequest.is(x);
  }

  authToken: string;
  readonly action = 'off';

  constructor(authToken: string) {
    this.authToken = authToken;
  }
}

export class GetPatternRequest implements AuthorisedRequest {
  public static is(x: any): x is GetPatternRequest {
    return (
      x.action === 'get' &&
      (x.channel === 'all' || typeof x.channel === 'number') &&
      AuthorisedRequest.is(x)
    );
  }

  authToken: string;
  readonly action = 'get';
  channel: number | 'all';

  constructor(authToken: string, channel: number | 'all') {
    this.authToken = authToken;
    this.channel = channel;
  }
}

export class SetPatternRequest implements AuthorisedRequest {
  public static is(x: any): x is SetPatternRequest {
    return Boolean(
      x.action === 'set' &&
        (x.channel === 'all' || typeof x.channel === 'number') &&
        x.pattern &&
        isPattern(x.pattern) &&
        AuthorisedRequest.is(x),
    );
  }

  authToken: string;
  readonly action = 'set';
  channel: number | 'all';
  pattern: IPattern;

  constructor(authToken: string, channel: number | 'all', pattern: IPattern) {
    this.authToken = authToken;
    this.channel = channel;
    this.pattern = pattern;
  }
}

export class SetPatternsRequest implements AuthorisedRequest {
  public static is(x: any): x is SetPatternsRequest {
    if (x.action !== 'set') return false;
    if (!x.patterns || !Array.isArray(x.patterns)) return false;

    for (const pair of x.patterns) {
      if (!Array.isArray(pair) || pair.length !== 2) return false;
      const [channel, pattern] = pair; // eslint-disable-line @typescript-eslint/no-unsafe-assignment
      if (typeof channel !== 'number' || !isPattern(pattern)) return false;
    }

    return AuthorisedRequest.is(x);
  }

  authToken: string;
  readonly action = 'set';
  patterns: Array<[number, IPattern]>;

  constructor(authToken: string, patterns: Array<[number, IPattern]>) {
    this.authToken = authToken;
    this.patterns = patterns;
  }
}

export class SetAnimationsRequest implements AuthorisedRequest {
  public static is(x: any): x is SetAnimationsRequest {
    if (x.action !== 'set') return false;
    if (!x.animations || !Array.isArray(x.animations)) return false;

    for (const pair of x.animations) {
      if (!Array.isArray(pair) || pair.length !== 2) return false;
      const [channel, patterns] = pair; // eslint-disable-line @typescript-eslint/no-unsafe-assignment
      if (typeof channel !== 'number' || !isPatternArray(patterns)) return false;
    }

    return AuthorisedRequest.is(x);
  }

  authToken: string;
  readonly action = 'set';
  animations: Array<[number, IPattern[]]>;

  constructor(authToken: string, animations: Array<[number, IPattern[]]>) {
    this.authToken = authToken;
    this.animations = animations;
  }
}

export class SetMoodRequest implements AuthorisedRequest {
  public static is(x: any): x is SetMoodRequest {
    return (
      x.action === 'set' &&
      Object.values(Moods).includes(x.mood as Moods) &&
      AuthorisedRequest.is(x)
    );
  }

  authToken: string;
  readonly action = 'set';
  mood: Moods;

  constructor(authToken: string, mood: Moods) {
    this.authToken = authToken;
    this.mood = mood;
  }
}
