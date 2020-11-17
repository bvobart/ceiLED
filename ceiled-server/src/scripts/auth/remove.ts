import AuthRepository from '../../auth/AuthRepository';
import { Config } from '../../config';
import { connectToMongoDB } from '../../utils';
import * as prompts from 'prompts';

const fail = (message: any): never => {
  console.error('!-> ERROR:', message);
  process.exit(1);
};

const validateArgs = (): string[] => {
  const args = process.argv.slice(2);
  if (args.length == 0) fail('expecting at least one argument, but got none');
  return args;
};

const remove = async (namesOrTokens: string[]): Promise<void> => {
  console.log('--> Connecting to database...');
  const config = new Config();
  const db = await connectToMongoDB(config.db);
  const authRepo = new AuthRepository(db.collection(config.db.collection));
  console.log('--> Connected!');

  console.log(`--> ${namesOrTokens.length} Names / Tokens to be removed:`);
  for (const nameOrToken of namesOrTokens) {
    console.log(`- ${nameOrToken}`);
  }

  const res = await prompts({
    type: 'confirm',
    name: 'confirmed',
    message:
      'Are you sure you want to remove these names and authorisation tokens from the database?',
  });

  if (!res.confirmed) process.exit(1);

  const deletedCount = await authRepo.removeMany(namesOrTokens);
  console.log(`--> Succesfully deleted ${deletedCount} entries!`);
  process.exit(0);
};

// if launched directly through node, then launch.
if (require.main === module) {
  const args = validateArgs();
  remove(args).catch(fail);
}
