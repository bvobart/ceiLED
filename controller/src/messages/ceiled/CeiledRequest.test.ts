import Color from '../../common/Color';
import { CeiledRequest, CeiledRequestType } from './CeiledRequest';

describe('Request', () => {
  describe('isRequest', () => {
    it('correctly recognises a request', () => {
      const request: any = {
        type: CeiledRequestType.SOLID,
        brightness: 0,
        roomLight: 0,
        colors: [Color.BLACK, Color.WHITE]
      };
      expect(CeiledRequest.isRequest(request)).toBe(true);
    });

    it('recognises a request with invalid type', () => {
      const request: any = {
        type: 'pinguin',
        brightness: 0,
        roomLight: 0,
        colors: [Color.BLACK, Color.WHITE]
      };
      expect(CeiledRequest.isRequest(request)).toBe(false);
    });

    it('recognises a request without colours', () => {
      const request: any = {
        type: CeiledRequestType.SOLID,
        brightness: 0,
        roomLight: 0,
        colors: []
      };
      expect(CeiledRequest.isRequest(request)).toBe(false);
    });

    it('recognises a request with a badly constructed colour', () => {
      const request: any = {
        type: CeiledRequestType.SOLID,
        brightness: 0,
        roomLight: 0,
        colors: [{ red: 0, blue: 65 }]
      };
      expect(CeiledRequest.isRequest(request)).toBe(false);
    });
  });
});

