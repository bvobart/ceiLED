import { IncomingMessage } from 'http';
import * as WebSocket from 'ws';

import Color from './common/Color';
import LEDChannel from './hardware/LEDChannel';

const ch1 = new LEDChannel(1);

function handleClose(code: number, reason: string, clientIP: string): void {
  console.log("Connection with " + clientIP + " closed.");
};

function handleMessage(payload: string): void {
  const message = JSON.parse(payload);
  console.log("Message received: ", message);
  ch1.setColor(new Color(message.red, message.green, message.blue));
};

const server = new WebSocket.Server({ port: 6565 });
server.on('connection', (ws: WebSocket, req: IncomingMessage) => {
  const clientIP: string = req.connection.remoteAddress;
  // console.log("Connection incoming from ", clientIP);

  ws.on('message', handleMessage);
  // ws.on('close', (code: number, reason: string) => handleClose(code, reason, clientIP));
});

server.on('error', (error: Error) => {
  console.log("Error occurred: ", error);
});

console.log(".--------------------------.");
console.log("| CeiLED Controller online |");
console.log("'--------------------------'");
