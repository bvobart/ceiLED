import { IncomingMessage } from 'http';
import * as WebSocket from 'ws';
import MessageHandler from './messages/MessageHandler';

function handleClose(code: number, reason: string, clientIP: string): void {
  console.log("Connection with " + clientIP + " closed.");
};

const server = new WebSocket.Server({ port: 6565 });
server.on('connection', (ws: WebSocket, req: IncomingMessage) => {
  const clientIP: string = req.connection.remoteAddress;
  // console.log("Connection incoming from ", clientIP);

  const msgHandler: MessageHandler = new MessageHandler(ws);
  // ws.on('close', (code: number, reason: string) => handleClose(code, reason, clientIP));
});

server.on('error', (error: Error) => {
  console.log("Error occurred: ", error);
});

console.log(".--------------------------.");
console.log("| CeiLED Controller online |");
console.log("'--------------------------'");
