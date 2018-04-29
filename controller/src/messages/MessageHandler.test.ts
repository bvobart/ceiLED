import Color from "../common/Color";
import { CeiledRequest, CeiledRequestType } from "./CeiledRequest";
import { CeiledResponse, CeiledResponseType } from "./CeiledResponse";
import MessageHandler from "./MessageHandler";

describe('MessageHandler', () => {
  describe('handle', () => {
    let socketMock: any;
    let handler: MessageHandler;

    beforeEach(() => {
      socketMock = {
        on: jest.fn(),
        emit: jest.fn((event: string) => console.log(event))
      }
      handler = new MessageHandler(socketMock);
      handler.sendSuccess = jest.fn();
      handler.sendFail = jest.fn();
      handler.sendError = jest.fn();
    });

    it('handles a correct message', () => {
      const colors: Color[] = [ Color.BLACK, Color.WHITE ];
      const request: CeiledRequest = new CeiledRequest(
        CeiledRequestType.SOLID,
        65,
        65,
        colors
      );
      const message: any = {
        data: request
      }
      handler.handle(JSON.stringify(message));
      const expected: CeiledResponse = new CeiledResponse(CeiledResponseType.SUCCES);
      const expectedResponse: string = JSON.stringify(expected);
      expect(handler.sendSuccess).toHaveBeenCalled();
      expect(handler.sendError).not.toHaveBeenCalled();
      expect(handler.sendFail).not.toHaveBeenCalled();
    });

    it('calls sendError when the message is not JSON parseable', () => {
      const message: string = "not parseable";
      handler.handle(message);
      expect(handler.sendError).toHaveBeenCalled();
      expect(handler.sendFail).not.toHaveBeenCalled();
      expect(handler.sendSuccess).not.toHaveBeenCalled();
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
      handler.handle(JSON.stringify(message));
      expect(handler.sendFail).toHaveBeenCalled();
      expect(handler.sendError).not.toHaveBeenCalled();
      expect(handler.sendSuccess).not.toHaveBeenCalled();
    })
  });
});