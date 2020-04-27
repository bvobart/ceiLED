import { Moods } from '../../moods';
import { IPattern, isPattern, isPatternArray } from '../../patterns/Pattern';
import { AuthorisedRequest } from './common';

/* tslint:disable:max-classes-per-file */

export class OffRequest implements AuthorisedRequest {
  public static is(x: any): x is OffRequest {
    return x.action === 'off' && AuthorisedRequest.is(x);
  }

  public authToken: string;
  public action: 'off';
}

export class GetPatternRequest implements AuthorisedRequest {
  public static is(x: any): x is GetPatternRequest {
    return (
      x.action === 'get' &&
      (x.channel === 'all' || typeof x.channel === 'number') &&
      AuthorisedRequest.is(x)
    );
  }

  public authToken: string;
  public action: 'get';
  public channel: number | 'all';
}

export class SetPatternRequest implements AuthorisedRequest {
  public static is(x: any): x is SetPatternRequest {
    return (
      x.action === 'set' &&
      (x.channel === 'all' || typeof x.channel === 'number') &&
      x.pattern &&
      isPattern(x.pattern) &&
      AuthorisedRequest.is(x)
    );
  }

  public authToken: string;
  public action: 'set';
  public channel: number | 'all';
  public pattern: IPattern;
}

export class SetPatternsRequest implements AuthorisedRequest {
  public static is(x: any): x is SetPatternsRequest {
    if (x.action !== 'set') return false;
    if (!x.patterns || !Array.isArray(x.patterns)) return false;

    for (const pair of x.patterns) {
      if (!Array.isArray(pair) || pair.length !== 2) return false;
      const [channel, pattern] = pair;
      if (typeof channel !== 'number' || !isPattern(pattern)) return false;
    }

    return AuthorisedRequest.is(x);
  }

  public authToken: string;
  public action: 'set';
  public patterns: Array<[number, IPattern]>;
}

export class SetAnimationsRequest implements AuthorisedRequest {
  public static is(x: any): x is SetAnimationsRequest {
    if (x.action !== 'set') return false;
    if (!x.animations || !Array.isArray(x.animations)) return false;

    for (const pair of x.animations) {
      if (!Array.isArray(pair) || pair.length !== 2) return false;
      const [channel, patterns] = pair;
      if (typeof channel !== 'number' || !isPatternArray(patterns)) return false;
    }

    return AuthorisedRequest.is(x);
  }

  public authToken: string;
  public action: 'set';
  public animations: Array<[number, IPattern[]]>;
}

export class SetMoodRequest implements AuthorisedRequest {
  public static is(x: any): x is SetMoodRequest {
    return x.action === 'set' && Object.values(Moods).includes(x.mood) && AuthorisedRequest.is(x);
  }

  public authToken: string;
  public action: 'set';
  public mood: Moods;
}
