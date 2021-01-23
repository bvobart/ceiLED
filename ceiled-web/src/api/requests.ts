import { Moods } from './moods';
import { IPattern } from './patterns';

export interface AuthorisedRequest {
  authToken: string;
}

export interface GetSettingRequest extends AuthorisedRequest {
  authToken: string;
  action: 'get';
}

export interface SetSettingRequest<T> extends AuthorisedRequest {
  authToken: string;
  action: 'set';
  value: T;
}

export interface GetPatternRequest extends AuthorisedRequest {
  authToken: string;
  action: 'get';
  channel: number | 'all';
}

export interface SetPatternRequest extends AuthorisedRequest {
  authToken: string;
  action: 'set';
  channel: number | 'all';
  pattern: IPattern;
}

export interface SetPatternsRequest extends AuthorisedRequest {
  authToken: string;
  action: 'set';
  patterns: Array<[number, IPattern]>;
}

export interface SetAnimationsRequest extends AuthorisedRequest {
  authToken: string;
  action: 'set';
  animations: Array<[number, IPattern[]]>;
}

export interface SetMoodRequest extends AuthorisedRequest {
  authToken: string;
  action: 'set';
  mood: Moods;
}
