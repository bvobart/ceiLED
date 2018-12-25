import { settings } from "../../server";
import CeiledError from "../CeiledError";
import { IncomingMessage, MessageHandler, OutgoingMessage, StatusType } from "../MessageHandler";
import { SettingsErrorResponse } from "./SettingsErrorResponse";
import { SettingsMessage } from "./SettingsMessage";
import { SettingsSuccessResponse } from "./SettingsSuccessResponse";


/**
 * Handles any messages to set and retrieve settings on the controller.
 */
export class SettingsMessageHandler implements MessageHandler {
  
  public handle(message: IncomingMessage): OutgoingMessage {
    if (!message.settings) return null;
    if (SettingsMessage.isMessage(message.settings)) {
      const req: SettingsMessage = message.settings;
      switch (req.action) {
        case "get":
          return new SettingsSuccessResponse(SettingsMessage.buildGet(settings));
        case "set":
          // TODO: check authToken
          settings.brightness = inRange(req.brightness, 0, 100);
          settings.roomLight = inRange(req.roomLight, 0, 100);
          settings.flux = inRange(req.flux, -1, 5);
          if (req.driver) settings.setDriver(req.driver);
          return new SettingsSuccessResponse();
        default:
          const error: Error = new Error("Invalid action: " + message.settings.action);
          return new SettingsErrorResponse([new CeiledError(error)]);
      }
    }
    return null;
  }

}

/**
 * Ensures that a certain number value is within a certain range.
 * @param value the value
 * @param min minimum of the range
 * @param max maximum of the range.
 */
const inRange = (value: number, min: number, max: number): number => {
  return value < min ? min : value > max ? max : value;
}

export default SettingsMessageHandler;
