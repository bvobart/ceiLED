import { StatusType } from '../MessageHandler';
import CeiledError from './CeiledError';

export class CeiledResponse {
  public status: StatusType;
  public errors: CeiledError[];

  constructor(status: StatusType, errors?: Error[]) {
    this.status = status;
    this.errors = errors ? errors.map((value: Error) => new CeiledError(value)) : undefined;
  }
}