import CeiledError from './common/CeiledError';
import SettingsMessage from './settings/SettingsMessage';

/**
 * A class that implements MessageHandler takes an incoming message, does something with it,
 * and either returns an outgoing message, or null if no response should be sent.
 */
export interface MessageHandler {
  handle(message: IncomingMessage): Promise<OutgoingMessage>;
}

/**
 * An incoming message may contain several properties. The `data` property is used for CeiledMessages,
 * whereas the `settings` property is used for SettingsMessages. Both can be specified in one message,
 * essentially allowing the user to send multiple types of requests at the same time.
 *
 * Some operations require the user to be authorised, which is done through an authorisation token, as
 * contained in the `authToken` property.
 */
export interface IncomingMessage {
  data?: any;
  settings?: any;
  authToken?: string;
}

/**
 * Statuses of an outgoing message.
 */
export enum StatusType {
  SUCCES = 'success',
  FAIL = 'fail',
  ERROR = 'error',
  UNAUTHORISED = 'unauthorised',
  CLOSING = 'closing',
}

/**
 * An outgoing message always has a status (see StatusType) and either returns a settings object if
 * requested, or returns a list of errors if shit went wrong.
 */
export interface OutgoingMessage {
  status: StatusType;
  errors?: CeiledError[];
  settings?: SettingsMessage;
}
