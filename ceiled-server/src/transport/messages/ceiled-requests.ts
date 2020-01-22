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
    if (x.patterns && x.patterns instanceof Map) {
      for (const [channel, pattern] of x.patterns.entries()) {
        if (typeof channel !== 'number' || !isPattern(pattern)) return false;
      }

      return AuthorisedRequest.is(x);
    }
    return false;
  }

  public authToken: string;
  public action: 'set';
  public patterns: Array<[number, IPattern]>;
}

export class SetAnimationsRequest implements AuthorisedRequest {
  public static is(x: any): x is SetAnimationsRequest {
    if (x.action !== 'set') return false;
    if (x.animations && x.animations instanceof Map) {
      for (const [channel, patterns] of x.animations.entries()) {
        if (typeof channel !== 'number' || !isPatternArray(patterns)) return false;
      }

      return AuthorisedRequest.is(x);
    }
    return false;
  }

  public authToken: string;
  public action: 'set';
  public animations: Array<[number, IPattern[]]>;
}
