import CeiledError from "../CeiledError";
import { OutgoingMessage, StatusType } from "../MessageHandler";

export class SettingsErrorResponse implements OutgoingMessage {
  public status: StatusType = StatusType.ERROR;
  public errors: CeiledError[];

  constructor(errors: CeiledError[]) {
    this.errors = errors;
  }
}

export default SettingsErrorResponse;
