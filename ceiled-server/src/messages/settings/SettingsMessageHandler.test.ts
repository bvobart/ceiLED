import { settings } from '../../ControllerSettings';
import { CeiledDriver } from '../../hardware/CeiledDriver';
import { IncomingMessage, OutgoingMessage, StatusType } from '../MessageHandler';
import SettingsMessageHandler from './SettingsMessageHandler';
import { SettingsSuccessResponse } from './SettingsSuccessResponse';

jest.mock('../../auth/auth');
jest.mock('../../hardware/CeiledDriver');

describe('SettingsMessageHandler', () => {
  const handler = new SettingsMessageHandler(new CeiledDriver(null, 3));

  describe('get message', () => {
    it('gets the settings', async done => {
      const msg: IncomingMessage = { settings: { action: 'get' } };
      const response: OutgoingMessage = await handler.handle(msg);
      expect(response).toBeInstanceOf(SettingsSuccessResponse);
      expect(response.status).toBe(StatusType.SUCCES);
      expect(response.settings.action).toBe('get');
      expect(response.settings.brightness).toBe(settings.brightness);
      expect(response.settings.roomLight).toBe(settings.roomLight);
      expect(response.settings.flux).toBe(settings.flux);
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
      expect(settings.brightness).toBe(msg.settings.brightness);
      expect(settings.roomLight).toBe(msg.settings.roomLight);
      expect(settings.flux).toBe(msg.settings.flux);
      done();
    });
  });
});
