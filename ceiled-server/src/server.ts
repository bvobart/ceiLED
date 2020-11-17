import * as Bluebird from 'bluebird';
Bluebird.config({ cancellation: true });

import AuthRepository from './auth/AuthRepository';
import { CeiledDriver } from './hardware/CeiledDriver';
import { CeiledService } from './service/CeiledService';
import { APIServer } from './transport/APIServer';
import { Config } from './config';
import { connectToMongoDB } from './utils';

/**
 * Launches the CeiLED Controller server
 */
const launch = async (): Promise<void> => {
  const config = new Config();

  const driver = new CeiledDriver(config.socketFile, 3);
  await driver.connect();

  const service = new CeiledService(driver);

  // initialise authorisation repository
  const db = await connectToMongoDB(config.db);
  const authRepo = new AuthRepository(db.collection(config.db.collection));

  // start API server
  const server = new APIServer(service, authRepo);
  if (config.insecure) {
    server.listen(config.port);
  } else {
    server.listen(config.port, config.keyFile, config.certFile);
  }

  /**
   * When the main process exits, this function performs a graceful shutdown.
   * @param code Exit code
   */
  const onExit = (code: any) => {
    driver.close();
    void server.close();
    process.exit(code);
  };

  // register exit handler.
  process.on('SIGUSR1', onExit);
  process.on('SIGUSR2', onExit);
  process.on('SIGINT', onExit);
  process.on('SIGTERM', onExit);

  console.log('.----------------------------');
  console.log('| CeiLED Server online ');
  console.log(`| ws${config.insecure ? '' : 's'}://localhost:${config.port}`);
  if (config.insecure) console.log('| API is being hosted over an insecure WebSocket');
  console.log("'----------------------------\n");
};

// if launched directly through node, then launch.
if (require.main === module) {
  launch().catch((reason: any) => {
    console.error('!---------------------------!');
    console.error('| FATAL ERROR OCCURRED       ');
    console.error('| ', reason);
    console.error('!---------------------------!\n');
    console.error('--> Exiting...');
    process.exit(1);
  });
}
