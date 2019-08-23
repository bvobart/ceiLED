import Color from '../../common/Color';
import { CeiledDriver } from '../../hardware/CeiledDriver';
import CeiledError from '../common/CeiledError';
import { OutgoingMessage, StatusType } from '../MessageHandler';
import CeiledMessageHandler from './CeiledMessageHandler';
import { CeiledRequest, CeiledRequestType } from './CeiledRequest';
import { CeiledResponse } from './CeiledResponse';

jest.mock('../../auth/auth');
jest.mock('../../hardware/CeiledDriver');

describe('CeiledMessageHandler', () => {
  describe('handle', () => {
    const handler: CeiledMessageHandler = new CeiledMessageHandler(new CeiledDriver('', 3));

    it('handles a correct message', async done => {
      const colors: Color[] = [Color.BLACK, Color.WHITE];
      const request: CeiledRequest = new CeiledRequest(CeiledRequestType.SOLID, colors);
      const message: any = { data: request, authToken: 'test' };
      const response: OutgoingMessage = await handler.handle(message);
      const expected: CeiledResponse = new CeiledResponse(StatusType.SUCCES);
      expect(response).toEqual(expected);
      done();
    });

    it('calls sendFail when the message is not constructed properly', async done => {
      const message: any = {
        data: {
          type: 'jemoeder',
          colors: [],
        },
        authToken: 'test',
      };
      const response: OutgoingMessage = await handler.handle(message);
      const expected: CeiledResponse = {
        status: StatusType.FAIL,
        errors: [expect.any(CeiledError)],
      };
      expect(response).toEqual(expected);
      done();
    });
  });
});
