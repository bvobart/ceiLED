const MongoClient = require('mongodb').MongoClient;

const dbName = 'ceiled';
const collectionName = 'authorisedTokens';

/**
 * Adds a user with the specified authorisation token and name to the DB.
 * This person will now be authorised to perform operations on the controller.
 * @param {String} token The authorisation token
 * @param {String} name The name of the device that belongs to this authorisation token
 */
const addUserToDB = async (token, name) => {
  const client = await MongoClient.connect(
    'mongodb://localhost:27017',
    { useNewUrlParser: true },
  );
  console.log('Connected to MongoDB');

  const collection = client.db(dbName).collection(collectionName);
  const res = await collection.insertOne({ token, name });
  if (!res.result.ok) throw new Error('Insertion of auth token failed for some weird reason');
};

const printSuccess = () => {
  console.log('Successfully added user to DB');
  process.exit(0);
};

const printError = error => {
  console.error('\nAn error occurred while adding the user to the DB: ');
  console.error(error + '\n');
  process.exit(1);
};

const printUsage = () => {
  console.log('\nUsage: \n');
  console.log('TOKEN=1234512123 NAME="Example name" node addToken.js');
  process.exit(0);
};

if (require.main === module) {
  const token = process.env.TOKEN;
  const userName = process.env.NAME;

  if (!token || !userName) printUsage();
  if (!token.match('^[0-9]+$')) {
    console.error('\nError: Token contains non-numeric characters:');
    console.error('  ' + token + '\n');
    process.exit(1);
  }

  console.log('Adding user...');
  console.log('  name:', userName);
  console.log('  token:', token);

  addUserToDB(token, userName)
    .then(printSuccess)
    .catch(printError);
}
