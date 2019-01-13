import { OutgoingMessage, StatusType } from '../MessageHandler';
import CeiledError from './CeiledError';

export class UnauthorisedResponse implements OutgoingMessage {
  public status: StatusType = StatusType.UNAUTHORISED;
  public errors: CeiledError[] = [new CeiledError(new Error('You are not authorised to do that'))];
}

export default UnauthorisedResponse;
