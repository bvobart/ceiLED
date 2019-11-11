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
