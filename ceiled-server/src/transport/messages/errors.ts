import { Events } from '../APIServer';

export interface ErrorMessage {
  message: string;
}

export class InvalidRequestMessage implements ErrorMessage {
  public event: Events;
  public request: any;
  public message = 'Invalid request';

  constructor(event: Events, request: any) {
    this.event = event;
    this.request = request;
  }
}
