import CeiledError from './CeiledError';

export enum CeiledResponseType {
  SUCCES = 'success',
  FAIL = 'fail',
  ERROR = 'error'
}

export class CeiledResponse {
  public status: CeiledResponseType;
  public errors: CeiledError[];

  constructor(status: CeiledResponseType, errors?: Error[]) {
    this.status = status;
    this.errors = errors ? errors.map((value: Error) => new CeiledError(value)) : undefined;
  }
}