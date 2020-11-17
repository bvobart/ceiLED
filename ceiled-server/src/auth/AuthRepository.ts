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

  public async create(token: string, name: string): Promise<void> {
    const res = await this.collection.insertOne({ token, name });
    if (!res.result.ok) throw new Error('Auth token was not inserted an unknown reason');
  }

  public async list(): Promise<Auth[]> {
    return this.collection.find().toArray();
  }

  /**
   * Deletes an entry in the authorisation DB by name or token.
   * Returns the amount of documents deleted.
   * @param nameOrToken the name or token by which to find the entry
   */
  public async remove(nameOrToken: string): Promise<number> {
    const res = await this.collection.deleteOne({
      $or: [{ name: nameOrToken }, { token: nameOrToken }],
    });
    return res.deletedCount || 0;
  }

  /**
   * Deletes all entries in the authorisation DB with a name or token contained in the given array.
   * Returns the amount of documents deleted.
   * @param nameOrToken the names or tokens by which to find the entries
   */
  public async removeMany(namesOrTokens: string[]): Promise<number> {
    const res = await this.collection.deleteMany({
      $or: [{ name: { $in: namesOrTokens } }, { token: { $in: namesOrTokens } }],
    });
    return res.deletedCount || 0;
  }
}

export default AuthRepository;
