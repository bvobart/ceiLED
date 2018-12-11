import { IControllerSettings } from "../ControllerSettings";
import CeiledError from "./ceiled/CeiledError";

export interface IncomingMessage {
  data?: any;
  settings?: any;
}

export enum StatusType {
  SUCCES = 'success',
  FAIL = 'fail',
  ERROR = 'error'
}

export interface OutgoingMessage {
  status: StatusType;
  errors?: CeiledError[];
  settings?: IControllerSettings;
}

export interface MessageHandler {
  handle(message: IncomingMessage): OutgoingMessage
}
