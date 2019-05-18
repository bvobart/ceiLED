import { settings } from '../../server';
import { IncomingMessage, OutgoingMessage, StatusType } from '../MessageHandler';
import SettingsMessageHandler from './SettingsMessageHandler';
import { SettingsSuccessResponse } from './SettingsSuccessResponse';

jest.mock('../../auth/auth');

describe('SettingsMessageHandler', () => {
  const handler = new SettingsMessageHandler();

  describe('get message', () => {
    it('gets the settings', async done => {
      const msg: IncomingMessage = { settings: { action: 'get' } };
      const response: OutgoingMessage = await handler.handle(msg);
      expect(response).toBeInstanceOf(SettingsSuccessResponse);
      expect(response.status).toBe(StatusType.SUCCES);
      expect(response.settings.action).toBe('get');
      expect(response.settings.brightness).toBe(settings.getBrightness());
      expect(response.settings.roomLight).toBe(settings.getRoomLight());
      expect(response.settings.flux).toBe(settings.getFlux());
      done();
    });
  });

  describe('set message', () => {
    it('sets some settings', async done => {
      const msg: IncomingMessage = {
        settings: { action: 'set', brightness: 65, roomLight: 42, flux: 3 },
        authToken: 'test',
      };
      const response: OutgoingMessage = await handler.handle(msg);
      expect(response).toBeInstanceOf(SettingsSuccessResponse);
      expect(response.status).toBe(StatusType.SUCCES);
      expect(settings.getBrightness()).toBe(msg.settings.brightness);
      expect(settings.getRoomLight()).toBe(msg.settings.roomLight);
      expect(settings.getFlux()).toBe(msg.settings.flux);
      done();
    });
  });
});
