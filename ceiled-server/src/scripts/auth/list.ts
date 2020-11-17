import AuthRepository from '../../auth/AuthRepository';
import { Config } from '../../config';
import { connectToMongoDB } from '../../utils';

const fail = (message: any): never => {
  console.error('!-> ERROR:', message);
  process.exit(1);
};

const list = async (): Promise<void> => {
  console.log('--> Connecting to database...');
  const config = new Config();
  const db = await connectToMongoDB(config.db);
  const authRepo = new AuthRepository(db.collection(config.db.collection));
  console.log('--> Connected!');

  const auths = await authRepo.list();
  if (auths.length === 0) console.log('--> No authorisation tokens found');
  else console.log('--> Found the following authorisation tokens:');

  for (const auth of auths) {
    console.log(`- Name: '${auth.name}' - Token: ${auth.token}`);
  }
  process.exit(0);
};

// if launched directly through node, then launch.
if (require.main === module) {
  list().catch(fail);
}
