import { Pattern, Animation } from "../components/animations";

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
  pattern: Pattern;
}

export interface SetPatternsRequest extends AuthorisedRequest {
  authToken: string;
  action: 'set';
  patterns: Map<number, Pattern>;
}

export interface SetAnimationsRequest extends AuthorisedRequest {
  authToken: string;
  action: 'set';
  animations: Map<number, Animation>;
}
