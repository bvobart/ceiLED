import { MongoClient } from 'mongodb';
import { isAuthorised } from './auth';

jest.unmock('./auth');

describe('auth', () => {
  const address: string = process.env.CI ? 'mongodb://127.0.0.1' : 'mongodb://localhost:27017';

  describe('isAuthorised', () => {
    it('rejects a fake token', async done => {
      const dbClient = await MongoClient.connect(
        address,
        { useNewUrlParser: true },
      );
      const db = dbClient.db('ceiled');

      const token = 'fakeNews';
      expect(await isAuthorised(token, db)).toBe(false);
      done();
    });

    it.skip('accepts a correct token', async done => {
      const dbClient = await MongoClient.connect(
        address,
        { useNewUrlParser: true },
      );
      const db = dbClient.db('ceiled');
      const token = 'obscured';

      expect(await isAuthorised(token, db)).toBe(true);
      done();
    });
  });
});
