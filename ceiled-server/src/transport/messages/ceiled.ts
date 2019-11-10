import Pattern from '../../patterns/Pattern';

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
    return typeof x.channel === 'number' && AuthorisedRequest.is(x);
  }

  public authToken: string;
  public channel: number;
}

export class SetPatternRequest implements AuthorisedRequest {
  public static is(x: any): x is SetPatternRequest {
    return (
      (x.channel === 'all' || typeof x.channel === 'number') &&
      x.pattern &&
      typeof x.pattern.variant === 'string' &&
      AuthorisedRequest.is(x)
    );
  }

  public authToken: string;
  public channel: number | 'all';
  public pattern: Pattern; // MoodPattern | SolidPattern | AnimationPattern
}

export class SetMultiplePatternsRequest implements AuthorisedRequest {
  public static is(x: any): x is SetMultiplePatternsRequest {
    return x.patterns instanceof Map && AuthorisedRequest.is(x);
  }

  public authToken: string;
  public patterns: Map<number, Pattern>;
}
