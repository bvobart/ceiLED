import * as Bluebird from 'bluebird';
Bluebird.config({ cancellation: true });

import { readFileSync } from 'fs';
import { IncomingMessage } from 'http';
import { createServer } from 'https';
import { Db, MongoClient } from 'mongodb';
import * as WebSocket from 'ws';

import Color from './common/Color';
import { CeiledDriver } from './hardware/CeiledDriver';
import CeiledMessageHandler from './messages/ceiled/CeiledMessageHandler';
import { CeiledResponse } from './messages/ceiled/CeiledResponse';
import ShutdownMessage from './messages/common/ShutdownMessage';
import { MessageHandler, OutgoingMessage, StatusType } from './messages/MessageHandler';
import SettingsMessageHandler from './messages/settings/SettingsMessageHandler';
import SolidPattern from './patterns/SolidPattern';

// Controller DB. Used for authorisation tokens.
export let db: Db;

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

  // initialise driver and show some colours on our LEDs :P
  const ceiledDriver: CeiledDriver = new CeiledDriver(socketFile, 3);
  await ceiledDriver.connect();
  const colors: Color[] = [Color.random(), Color.random(), Color.random()];
  const pattern: SolidPattern = new SolidPattern(colors);
  pattern.show(ceiledDriver);

  // and some DB settings too, then initialise DB for authorisation requests.
  const dbHost: string = process.env.DB_HOST || 'localhost:27017';
  const dbName: string = 'ceiled';
  db = await initDB(dbHost, dbName);

  // start API server and create message handlers
  const server: WebSocket.Server = insecure
    ? initApiServer(port)
    : initSecureApiServer(port, keyFile, certFile);
  const ceiledHandler: CeiledMessageHandler = new CeiledMessageHandler(ceiledDriver);
  const settingsHandler: SettingsMessageHandler = new SettingsMessageHandler(ceiledDriver);

  /**
   * When the main process exits, this function performs a graceful shutdown by sending
   * any still connected clients a ShutdownMessage.
   * @param code Exit code
   */
  const onExit = (code: any) => {
    ceiledDriver.close();
    if (server) {
      let message: string = 'No clients were connected to server.';

      const numClients: number = server.clients.size;
      const awaitingClients: Array<Promise<Error>> = [];
      for (const ws of server.clients) {
        awaitingClients.push(
          new Promise<Error>(resolve => {
            const onSent = (err?: Error) => resolve(err);
            ws.send(JSON.stringify(new ShutdownMessage()), onSent);
            ws.removeAllListeners();
            ws.close();
          }),
        );
      }

      Promise.all(awaitingClients).then((notifiedClients: Error[]) => {
        const errored = notifiedClients.filter(value => value !== undefined).length;
        if (numClients > 0) {
          message =
            errored === 0
              ? `Notified ${numClients} clients of shutdown`
              : `Could not notify ${errored} out of the ${numClients} clients that were still connected`;
        }
        console.log(message);
        if (errored > 0) console.log(errored);
        server.removeAllListeners();
        server.close();
        return process.exit(code);
      });
      return;
    }
    console.log('No WebSocket server present anymore');
    return process.exit(code);
  };

  // When an error occurs in the WebSocket
  const onError = (error: Error) => console.error('Error occurred in WebSocket: \n', error, '\n');

  // When a WebSocket connection is opened
  const onConnection = (ws: WebSocket, req: IncomingMessage) => {
    const handlers: MessageHandler[] = [];
    handlers.push(ceiledHandler);
    handlers.push(settingsHandler);

    const clientIP: string = req.connection.remoteAddress;
    console.log('Client with IP', clientIP, 'connected.\n');

    ws.on('close', () => console.log('Client with IP', clientIP, 'disconnected\n'));
    ws.on('message', async (payload: string) => {
      try {
        const message = JSON.parse(payload);
        const handleMessage = async (handler: MessageHandler) => {
          const response: OutgoingMessage = await handler.handle(message);
          if (response && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify(response));
          }
        };
        await Promise.all(handlers.map(handleMessage));
      } catch (error) {
        console.error('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
        console.error('- Internal error: ', error);
        console.error('-------------------------------\n');
        const response: CeiledResponse = new CeiledResponse(StatusType.ERROR, [error]);
        ws.send(JSON.stringify(response));
      }
    });
  };

  // register connection, error and exit handlers.
  server.on('connection', onConnection);
  server.on('error', onError);

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
const initDB = async (dbHost: string, dbName: string): Promise<Db> => {
  const dbClient = await MongoClient.connect('mongodb://' + dbHost, { useNewUrlParser: true });
  return dbClient.db(dbName);
};

/**
 * Creates and launches an insecure WebSocket server on the given port.
 * @param port port to listen on
 */
const initApiServer = (port: number): WebSocket.Server => {
  return new WebSocket.Server({ port });
};

/**
 * Creates and launches a secure WebSocket server on the given port,
 * using the SSL key and certificate at the given file locations.
 * @param port port to listen on
 * @param keyFile path to SSL private key file
 * @param certFile path to SSL public certificate file
 */
const initSecureApiServer = (port: number, keyFile: string, certFile: string): WebSocket.Server => {
  const httpsServer = createServer({
    key: readFileSync(keyFile),
    cert: readFileSync(certFile),
  });
  httpsServer.listen(port);
  return new WebSocket.Server({ server: httpsServer });
};

// if launched directly through node, then launch.
if (require.main === module) {
  launch().catch((reason: any) => {
    console.error('.----------------------------');
    console.error('| FATAL ERROR OCCURRED       ');
    console.error('| ' + reason);
    console.error('');
    console.error('Exiting...');
    process.exit(1);
  });
}
