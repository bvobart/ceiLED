/* tslint:disable:max-classes-per-file */
import { Events } from '../APIServer';

export interface ErrorMessage {
  message: string;
}

export class InvalidRequestMessage implements ErrorMessage {
  public message = 'Invalid request';
  public event: Events;
  public request: unknown;

  constructor(event: Events, request: unknown) {
    this.event = event;
    this.request = request;
  }
}

export class UnauthorisedMessage implements ErrorMessage {
  public message = 'Error: Unauthorised! Please add your authorisation token to the auth database';
}

export class InternalErrorMessage implements ErrorMessage {
  public message: string;
  public event: Events;
  public request: unknown;
  public stackTrace: string;

  constructor(event: Events, request: unknown, error: Error) {
    this.message = error.message;
    this.stackTrace = error.stack || 'Stacktrace unknown';
    this.event = event;
    this.request = request;
  }
}
