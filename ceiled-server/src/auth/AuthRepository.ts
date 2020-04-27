import { Collection, ObjectId } from 'mongodb';

export interface Auth {
  id?: ObjectId;
  name: string;
  token: string;
}

export class AuthRepository {
  private collection: Collection<Auth>;

  constructor(collection: Collection<Auth>) {
    this.collection = collection;
  }

  public findByToken(token: string): Promise<Auth | null> {
    return this.collection.findOne({ token });
  }

  public create(token: string, name: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await this.collection.insertOne({ token, name });
        return res.result.ok ? resolve() : reject('Auth token was not inserted for some reason');
      } catch (error) {
        return reject(error);
      }
    });
  }
}

export default AuthRepository;
