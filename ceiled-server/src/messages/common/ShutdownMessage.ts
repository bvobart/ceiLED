import { OutgoingMessage, StatusType } from '../MessageHandler';

export class ShutdownMessage implements OutgoingMessage {
  public status: StatusType = StatusType.CLOSING;
}

export default ShutdownMessage;
