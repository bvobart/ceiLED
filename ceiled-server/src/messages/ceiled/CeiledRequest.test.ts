import Color from '../../common/Color';
import { CeiledRequest, CeiledRequestType } from './CeiledRequest';

describe('CeiledRequest', () => {
  describe('isRequest', () => {
    it('correctly recognises a request', () => {
      const request: any = {
        type: CeiledRequestType.SOLID,
        colors: [Color.BLACK, Color.WHITE],
      };
      expect(CeiledRequest.isRequest(request)).toBe(true);
    });

    it('recognises a request with invalid type', () => {
      const request: any = {
        type: 'pinguin',
        colors: [Color.BLACK, Color.WHITE],
      };
      expect(CeiledRequest.isRequest(request)).toBe(false);
    });

    it('recognises an off request', () => {
      const request: any = {
        type: CeiledRequestType.OFF,
        colors: [],
      };
      expect(CeiledRequest.isRequest(request)).toBe(true);
    });

    it('recognises a request with a badly constructed colour', () => {
      const request: any = {
        type: CeiledRequestType.SOLID,
        colors: [{ red: 0, blue: 65 }],
      };
      expect(CeiledRequest.isRequest(request)).toBe(false);
    });
  });
});
