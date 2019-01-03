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

import FadePattern, { FadeType } from './patterns/FadePattern';
import SolidPattern from './patterns/SolidPattern';

const port = process.env.PORT || 6565;
const keyFile = process.env.KEY_FILE || 'localhost.key.pem';
const certFile = process.env.CERT_FILE || 'localhost.cert.pem';

export const test = process.env.TEST || false;
export const debug = process.argv[2] === 'debug';
const insecure = process.argv[2] === 'insecure' || false; // TODO: correct command line options.

// Controller settings
export let settings: ControllerSettings = new ControllerSettings({
  brightness: 100,
  roomLight: 0,
  flux: -1,
  driverType: test || debug ? DriverType.DEBUG : DriverType.PCA9685,
});

// Controller DB. Used for authorisation tokens.
export let db: Db;
const dbHost = process.env.DB_HOST || 'localhost:27017';
const dbName = 'ceiled';

/**
 * Launches the CeiLED Controller server
 */
const launch = async (): Promise<void> => {
  const dbClient = await MongoClient.connect(
    'mongodb://' + dbHost,
    { useNewUrlParser: true },
  );
  db = dbClient.db(dbName);

  let server: WebSocket.Server;
  if (insecure) {
    server = new WebSocket.Server({ port: 6565 });
  } else {
    const httpsServer = createServer({
      key: readFileSync(__dirname + '/../' + keyFile),
      cert: readFileSync(__dirname + '/../' + certFile),
    });
    server = new WebSocket.Server({ server: httpsServer });
    httpsServer.listen(port);
  }

  const ceiledHandler: CeiledMessageHandler = new CeiledMessageHandler();
  const settingsHandler: SettingsMessageHandler = new SettingsMessageHandler();

  const onConnection = (ws: WebSocket, req: IncomingMessage) => {
    const handlers: MessageHandler[] = [];
    const clientIP: string = req.connection.remoteAddress;
    handlers.push(ceiledHandler);
    handlers.push(settingsHandler);

    console.log('Client with IP', clientIP, 'connected.');

    ws.on('message', (payload: string) => {
      try {
        const message = JSON.parse(payload);

        handlers.forEach(async (handler: MessageHandler) => {
          const response: OutgoingMessage = await handler.handle(message);
          if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(response));
        });
      } catch (error) {
        console.error('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
        console.error('- Internal error: ', error);
        console.error('-------------------------------');
        const response: CeiledResponse = new CeiledResponse(StatusType.ERROR, [error]);
        ws.emit(JSON.stringify(response));
      }
    });
    ws.on('close', () => console.log('Client with IP', clientIP, 'disconnected'));
  };

  const onError = (error: Error) => {
    console.log('Error occurred: ', error);
  };

  server.on('connection', onConnection);
  server.on('error', onError);

  console.log('.--------------------------.');
  console.log('| CeiLED Controller online |');
  console.log("'--------------------------'");
  console.log();

  // (async () => {
  //   console.log('Starting fade timing tests');
  //   const expectedDuration: number = 100; // milliseconds
  //   const tries: number = 100;

  //   let sumDeviation: number = 0;
  //   const channel = ChannelStore.getInstance().channel1;
  //   for (let i = 0; i < tries; i++) {
  //     const start = new Date().getTime();
  //     await channel.setFade(Color.GREEN, Color.BLUE, expectedDuration / 1000)
  //     const end = new Date().getTime();

  //     const duration = end - start; // milliseconds
  //     const difference  = duration - expectedDuration;
  //     const deviation = difference / expectedDuration;
  //     sumDeviation += deviation;
  //     console.log('Nr.', i, 'Duration:', duration, ', Deviation: ', deviation);
  //   }

  //   console.log('Total deviation:', sumDeviation);
  //   console.log('Average deviation:', sumDeviation / tries);
  // })();

  const testColor: Color = new Color({ red: 65, green: 65, blue: 65 });
  const colors: Color[] = [Color.RED, Color.GREEN, testColor];
  // const colors2: Color[] = [Color.GREEN, Color.BLUE, Color.RED];
  // const colors3: Color[] = [Color.BLUE, Color.RED, Color.GREEN];
  // const pattern: FadePattern = new FadePattern(colors, 100, 0, {
  //   speed: 120,
  //   channels: 3,
  //   fadeType: FadeType.NORMAL,
  //   colors2,
  //   colors3
  // });
  // pattern.show();

  const pattern: SolidPattern = new SolidPattern(colors);
  pattern.show();
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
