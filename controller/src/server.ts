import { readFileSync } from 'fs';
import { IncomingMessage } from 'http';
import { createServer } from 'https';
import * as WebSocket from 'ws';

import Color from './common/Color';
import ChannelStore from './hardware/ChannelStore';
import DebugDriver from './hardware/DebugDriver';
import Pin from './hardware/Pin';
import MessageHandler from './messages/MessageHandler';
import FadePattern, { FadeType } from './patterns/FadePattern';
import SolidPattern from './patterns/SolidPattern';

const port = process.env.PORT || 6565;
const keyFile = process.env.KEY_FILE || 'localhost.key.pem';
const certFile = process.env.CERT_FILE || 'localhost.cert.pem';

// Statically initialise ChannelStore and the accompanying channels.
ChannelStore.getInstance();
// Initialise pin driver.
if (process.argv[2] === '--debug') Pin.setDriver(new DebugDriver());
else Pin.initializeDriver();


const httpsServer = createServer({
  key: readFileSync(__dirname + '/../' + keyFile),
  cert: readFileSync(__dirname + '/../' + certFile)
})
const wsServer = new WebSocket.Server({ server: httpsServer });

wsServer.on('connection', (ws: WebSocket, req: IncomingMessage) => {
  const clientIP: string = req.connection.remoteAddress;
  const msgHandler: MessageHandler = new MessageHandler(ws);
  console.log('Client with IP', clientIP, 'connected.');
  ws.on('close', () => console.log('Client with IP', clientIP, 'disconnected'));
});

wsServer.on('error', (error: Error) => {
  console.error("Error occurred: ", error);
});

httpsServer.listen(port);

console.log(".--------------------------.");
console.log("| CeiLED Controller online |");
console.log("'--------------------------'");


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

const pattern: SolidPattern = new SolidPattern(colors, 100, 0);
pattern.show();
