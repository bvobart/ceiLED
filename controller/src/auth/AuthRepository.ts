import { Db, ObjectId } from 'mongodb';
import { db } from '../server';

const collectionName: string = 'authorisedTokens';

export interface Auth {
  id: ObjectId;
  name: string;
  token: string;
}

export class AuthRepository {
  private db: Db;

  constructor(dbParam?: Db) {
    this.db = dbParam || db;
  }

  public findByToken(token: string): Promise<Auth> {
    return this.db.collection(collectionName).findOne({ token });
  }

  public create(token: string, name: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await this.db.collection(collectionName).insertOne({ token, name });
        return res.result.ok ? resolve() : reject('Auth token was not inserted for some reason');
      } catch (error) {
        return reject(error);
      }
    });
  }
}

export default AuthRepository;
