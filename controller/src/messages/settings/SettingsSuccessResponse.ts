import { OutgoingMessage, StatusType } from '../MessageHandler';
import SettingsMessage from './SettingsMessage';

export class SettingsSuccessResponse implements OutgoingMessage {
  public status: StatusType = StatusType.SUCCES;
  public settings?: SettingsMessage;

  constructor(settings?: SettingsMessage) {
    this.settings = settings;
  }
}
