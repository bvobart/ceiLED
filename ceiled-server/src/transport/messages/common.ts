import { isType, PrimitiveOrConstructor } from './utils';

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

export abstract class AuthorisedRequest {
  public static is(x: any): x is AuthorisedRequest {
    return typeof x.authToken === 'string';
  }

  authToken: string;

  constructor(authToken: string) {
    this.authToken = authToken;
  }
}

export class GetSettingRequest implements AuthorisedRequest {
  public static is(x: any): x is GetSettingRequest {
    return x.action === 'get' && AuthorisedRequest.is(x);
  }

  authToken: string;
  action = 'get';

  constructor(authToken: string) {
    this.authToken = authToken;
  }
}

export class SetSettingRequest<T> implements AuthorisedRequest {
  public static is<T>(x: any, valueType: PrimitiveOrConstructor<T>): x is SetSettingRequest<T> {
    return x.action === 'set' && isType(x.value, valueType) && AuthorisedRequest.is(x);
  }

  authToken: string;
  readonly action = 'set';
  value: T;

  constructor(authToken: string, value: T) {
    this.authToken = authToken;
    this.value = value;
  }
}
