import AuthRepository from '../../auth/AuthRepository';
import { Config } from '../../config';
import { connectToMongoDB } from '../../utils';
import * as prompts from 'prompts';

const fail = (message: any): never => {
  console.error('!-> ERROR:', message);
  process.exit(1);
};

const validateArgs = (): [string, string] => {
  const args = process.argv.slice(2);
  if (args.length != 2) {
    fail(`expecting exactly two arguments, but got ${args.length}`);
  }

  const [name, token] = args;

  // test if token consists purely of numbers
  if (!/^\d*$/.test(token)) {
    fail(`authorisation tokens only consist of numbers, but your token doesn't: ${token}`);
  }

  return [name, token];
};

const add = async (name: string, token: string): Promise<void> => {
  console.log('--> Connecting to database...');
  const config = new Config();
  const db = await connectToMongoDB(config.db);
  const authRepo = new AuthRepository(db.collection(config.db.collection));
  console.log('--> Connected!');

  console.log('- Name:', name);
  console.log('- Token:', token);

  const res = await prompts({
    type: 'confirm',
    name: 'confirmed',
    message: 'Are you sure you want to add this name and authorisation token to the database?',
  });

  if (res.confirmed) {
    await authRepo.create(token, name);
    console.log('--> Successfully added to authorisation database!');
    process.exit(0);
  } else {
    process.exit(1);
  }
};

// if launched directly through node, then launch.
if (require.main === module) {
  const [name, token] = validateArgs();
  add(name, token).catch(fail);
}

// TODO: implement list and remove
