/* tslint:disable:max-classes-per-file */
import { Events } from '../APIServer';

export interface ErrorMessage {
  message: string;
}

export class InvalidRequestMessage implements ErrorMessage {
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
  public message: string;
  public event: Events;
  public request: any;
  public stackTrace: string;

  constructor(event: Events, request: any, error: Error) {
    this.message = error.message;
    this.stackTrace = error.stack;
    this.event = event;
    this.request = request;
  }
}
