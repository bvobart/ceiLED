import * as Bluebird from 'bluebird';
Bluebird.config({ cancellation: true });

import { Db, MongoClient } from 'mongodb';

import AuthRepository from './auth/AuthRepository';
import { CeiledDriver } from './hardware/CeiledDriver';
import { CeiledService } from './service/CeiledService';
import { Service } from './service/Service';
import { APIServer } from './transport/APIServer';

/**
 * Launches the CeiLED Controller server
 */
const launch = async (): Promise<void> => {
  // set some server settings
  const port: number = parseInt(process.env.PORT, 10) || 6565;
  const insecure: boolean = process.env.INSECURE ? true : false;
  const keyFile: string = __dirname + '/../' + (process.env.KEY_FILE || 'localhost.key.pem');
  const certFile: string = __dirname + '/../' + (process.env.CERT_FILE || 'localhost.cert.pem');
  const socketFile: string =
    __dirname + '/../' + (process.env.CEILED_SOCKET || '../ceiled-driver/ceiled.sock');

  // and some DB settings too, then initialise DB for authorisation requests.
  const dbHost: string = process.env.DB_HOST || 'localhost:27017';
  const dbAuth: string = process.env.DB_AUTH || 'admin';
  const dbName: string = process.env.DB_NAME || 'ceiled';
  const dbUsername: string = process.env.DB_USERNAME || '';
  const dbPassword: string = process.env.DB_PASSWORD || '';
  const authCollection: string = 'authorisedTokens';

  // initialise driver
  const ceiledDriver: CeiledDriver = new CeiledDriver(socketFile, 3);
  await ceiledDriver.connect();

  // create service layer
  const service: Service = new CeiledService(ceiledDriver);

  // initialise authorisation repository
  const db = await initDB(dbHost, dbAuth, dbName, dbUsername, dbPassword);
  const authRepo = new AuthRepository(db.collection(authCollection));

  // start API server
  const server: APIServer = new APIServer(service, authRepo);
  if (insecure) {
    server.listen(port);
  } else {
    server.listen(port, keyFile, certFile);
  }

  /**
   * When the main process exits, this function performs a graceful shutdown.
   * @param code Exit code
   */
  const onExit = (code: any) => {
    ceiledDriver.close();
    server.close();
    return process.exit(code);
  };

  // register exit handler.
  process.on('SIGUSR1', onExit);
  process.on('SIGUSR2', onExit);
  process.on('SIGINT', onExit);
  process.on('SIGTERM', onExit);

  console.log('.----------------------------');
  console.log('| CeiLED Controller online ');
  console.log('| ws' + (insecure ? '' : 's') + '://localhost:' + port);
  if (insecure) console.log('| API is being hosted over an insecure WebSocket');
  console.log("'----------------------------\n");
};

/**
 * Initialises the connection to the database.
 */
const initDB = async (
  dbHost: string,
  dbAuth: string,
  dbName: string,
  dbUsername: string,
  dbPassword: string,
): Promise<Db> => {
  const creds = dbUsername !== '' ? `${dbUsername}${dbPassword}@` : '';
  const url = `mongodb://${creds}${dbHost}/${dbAuth}`;
  const dbClient = await MongoClient.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  return dbClient.db(dbName);
};

// if launched directly through node, then launch.
if (require.main === module) {
  launch().catch((reason: any) => {
    console.error('!---------------------------!');
    console.error('| FATAL ERROR OCCURRED       ');
    console.error('| ' + reason);
    console.error('!---------------------------!\n');
    console.error('--> Exiting...');
    process.exit(1);
  });
}
