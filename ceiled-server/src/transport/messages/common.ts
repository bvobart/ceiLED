/* tslint:disable:max-classes-per-file */

abstract class AuthorisedRequest {
  public static is(x: any): x is AuthorisedRequest {
    return typeof x.authToken === 'string';
  }

  public authToken: string;
}

class GetSettingRequest implements AuthorisedRequest {
  public static is(x: any): x is GetSettingRequest {
    return x.action === 'get' && AuthorisedRequest.is(x);
  }

  public authToken: string;
  public action: 'get';
}

class SetSettingRequest<T> implements AuthorisedRequest {
  public static is<T>(x: any, valueType: PrimitiveOrConstructor<T>): x is SetSettingRequest<T> {
    return x.action === 'set' && isType(x.value, valueType) && AuthorisedRequest.is(x);
  }

  public authToken: string;
  public action: 'set';
  public value: T;
}
