import { Db } from "mongodb";
import AuthRepository from "./AuthRepository";

/**
 * Checks whether a token is authorised to modify settings on the controller.
 * @param authToken the token to check
 * @param db DB object to use. By default, the authorisation repository will use the DB object as
 *           contained in `server.ts`, but this overrides that, e.g. for testing purposes.
 */
export const isAuthorised = async (authToken: string, db?: Db): Promise<boolean> => {
  const repo = new AuthRepository(db);
  const auth = await repo.findByToken(authToken);
  return auth ? Promise.resolve(true) : Promise.resolve(false);
}

export const getNameFromToken = async (authToken: string, db?: Db): Promise<string> => {
  const repo = new AuthRepository(db);
  const auth = await repo.findByToken(authToken);
  return auth ? Promise.resolve(auth.name) : Promise.reject('Unauthorised');
}
