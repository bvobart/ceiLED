import { Events } from ".";
import { IPattern, isPattern, isPatternArray } from "./patterns";

export interface ErrorMessage {
  message: string;
}

export class InvalidRequestMessage implements ErrorMessage {
  static is(x: any): x is InvalidRequestMessage {
    return x && typeof x.message === 'string'
      && Object.values(Events).includes(x.event)
      && x.request;
  }

  public message = 'Invalid request';
  public event: Events;
  public request: any;

  constructor(event: Events, request: any) {
    this.event = event;
    this.request = request;
  }
}

export class UnauthorisedMessage implements ErrorMessage {
  public message = 'You are not authorised to do that';
}

export class InternalErrorMessage implements ErrorMessage {
  static is(x: any): x is InternalErrorMessage {
    return x && typeof x.message === 'string' 
      && Object.values(Events).includes(x.event)
      && typeof x.stackTrace === 'string';
  }

  public message: string;
  public event: Events;
  public request: any;
  public stackTrace?: string;

  constructor(event: Events, request: any, error: Error) {
    this.message = error.message;
    this.stackTrace = error.stack;
    this.event = event;
    this.request = request;
  }
}

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
