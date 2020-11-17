import { Db, MongoClient } from 'mongodb';

export interface MongoConnectionOptions {
  host: string;
  auth: string;
  username: string;
  password: string;
  name: string;
}

/**
 * Initialises the connection to the database.
 */
export const connectToMongoDB = async (opts: MongoConnectionOptions): Promise<Db> => {
  const creds = opts.username !== '' ? `${opts.username}${opts.password}@` : '';
  const url = `mongodb://${creds}${opts.host}/${opts.auth}`;
  const dbClient = await MongoClient.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  return dbClient.db(opts.name);
};
