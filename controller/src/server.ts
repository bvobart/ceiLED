import { IncomingMessage } from 'http';
import * as WebSocket from 'ws';

import Color from './common/Color';
import ChannelStore from './hardware/ChannelStore';
import DebugDriver from './hardware/DebugDriver';
import Pin from './hardware/Pin';
import MessageHandler from './messages/MessageHandler';
import FadePattern, { FadeType } from './patterns/FadePattern';

const server = new WebSocket.Server({ port: 6565 });

server.on('connection', (ws: WebSocket, req: IncomingMessage) => {
  const clientIP: string = req.connection.remoteAddress;
  const msgHandler: MessageHandler = new MessageHandler(ws);
  console.log('Client with IP', clientIP, 'connected.');
  ws.on('close', () => console.log('Client with IP', clientIP, 'disconnected'));
});

server.on('error', (error: Error) => {
  console.log("Error occurred: ", error);
});

// Statically initialise ChannelStore and the accompanying channels.
ChannelStore.getInstance();

console.log(".--------------------------.");
console.log("| CeiLED Controller online |");
console.log("'--------------------------'");

if (process.argv[2] === '--debug') {
  Pin.setDriver(new DebugDriver());
}

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

const colors: Color[] = [Color.RED, Color.GREEN, Color.BLUE];
const colors2: Color[] = [Color.GREEN, Color.BLUE, Color.RED];
const colors3: Color[] = [Color.BLUE, Color.RED, Color.GREEN];
const pattern: FadePattern = new FadePattern(colors, 100, 0, {
  speed: 120,
  channels: 3, 
  fadeType: FadeType.NORMAL,
  colors2,
  colors3
});
pattern.show();

