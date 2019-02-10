import * as Bluebird from 'bluebird';
Bluebird.config({ cancellation: true });

import { readFileSync } from 'fs';
import { IncomingMessage } from 'http';
import { createServer } from 'https';
import { Db, MongoClient } from 'mongodb';
import * as WebSocket from 'ws';

import Color from './common/Color';
import { ControllerSettings, DriverType } from './ControllerSettings';
import CeiledMessageHandler from './messages/ceiled/CeiledMessageHandler';
import { CeiledResponse } from './messages/ceiled/CeiledResponse';
import { MessageHandler, OutgoingMessage, StatusType } from './messages/MessageHandler';
import SettingsMessageHandler from './messages/settings/SettingsMessageHandler';
import SolidPattern from './patterns/SolidPattern';

export const test = process.env.TEST || false;
export const debug = process.env.DEBUG || false;

// Controller settings
export const defaultSettings: ControllerSettings = new ControllerSettings({
  brightness: 100,
  roomLight: 0,
  flux: -1,
  driverType: test || debug ? DriverType.DEBUG : DriverType.PCA9685,
});
export let settings: ControllerSettings = defaultSettings;

// Controller DB. Used for authorisation tokens.
export let db: Db;

/**
 * Launches the CeiLED Controller server
 */
const launch = async (): Promise<void> => {
  // let's start by showing some colours on our LEDs :P
  const colors: Color[] = [Color.random(), Color.random(), Color.random()];
  const pattern: SolidPattern = new SolidPattern(colors);
  pattern.show();

  // then set some server settings
  const port: number = parseInt(process.env.PORT, 10) || 6565;
  const insecure: boolean = process.env.INSECURE ? true : false;
  const keyFile: string = __dirname + '/../' + (process.env.KEY_FILE || 'localhost.key.pem');
  const certFile: string = __dirname + '/../' + (process.env.CERT_FILE || 'localhost.cert.pem');

  // and some DB settings too, then initialise DB for authorisation requests.
  const dbHost: string = process.env.DB_HOST || 'localhost:27017';
  const dbName: string = 'ceiled';
  db = await initDB(dbHost, dbName);

  // start API server and create message handlers
  const server: WebSocket.Server = insecure
    ? initApiServer(port)
    : initSecureApiServer(port, keyFile, certFile);
  const ceiledHandler: CeiledMessageHandler = new CeiledMessageHandler();
  const settingsHandler: SettingsMessageHandler = new SettingsMessageHandler();

  const onError = (error: Error) => console.error('Error occurred in WebSocket: \n', error, '\n');
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
        ws.emit(JSON.stringify(response));
      }
    });
  };

  server.on('connection', onConnection);
  server.on('error', onError);

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
  const dbClient = await MongoClient.connect(
    'mongodb://' + dbHost,
    { useNewUrlParser: true },
  );
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
    console.error('Fatal error occurred: ');
    console.error(reason);
    console.error('Exiting...');
    process.exit(1);
  });
}
