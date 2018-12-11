import Color from "../../common/Color";
import { OutgoingMessage, StatusType } from "../MessageHandler";
import CeiledError from "./CeiledError";
import CeiledMessageHandler from "./CeiledMessageHandler";
import { CeiledRequest, CeiledRequestType } from "./CeiledRequest";
import { CeiledResponse } from "./CeiledResponse";

describe('MessageHandler', () => {
  describe('handle', () => {
    const handler: CeiledMessageHandler = new CeiledMessageHandler();

    it('handles a correct message', () => {
      const colors: Color[] = [ Color.BLACK, Color.WHITE ];
      const request: CeiledRequest = new CeiledRequest(
        CeiledRequestType.SOLID,
        65,
        65,
        colors
      );
      const message: any = { data: request }
      const response: OutgoingMessage = handler.handle(message);
      const expected: CeiledResponse = new CeiledResponse(StatusType.SUCCES);
      expect(response).toEqual(expected);
    });

    it('calls sendFail when the message is not constructed properly', () => {
      const message: any = {
        data: {
          type: 'jemoeder',
          brightness: 0,
          roomLight: 0,
          colors: []
        }
      };
      const response: OutgoingMessage = handler.handle(message);
      const expected: CeiledResponse = {
        status: StatusType.FAIL,
        errors: [expect.any(CeiledError)]
      }
      expect(response).toEqual(expected);
    })
  });
});