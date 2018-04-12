import * as WebSocket from 'ws';
import { IncomingMessage } from 'http';

function handleClose(code: number, reason: string, clientIP: string): void {
  console.log("Connection with " + clientIP + " closed.");
};

function handleMessage(message: IncomingMessage): void {
  console.log("Message received: ", message);
};

const server = new WebSocket.Server({ port: 6565 });
server.on('connection', (ws: WebSocket, req: IncomingMessage) => {
  const clientIP: string = req.connection.remoteAddress;
  //console.log("Connection incoming from ", clientIP);

  ws.on('message', handleMessage);
  ws.on('close', (code: number, reason: string) => handleClose(code, reason, clientIP));
});

server.on('error', (error: Error) => {
  console.log("Error occurred: ", error);
});

console.log(".--------------------------.");
console.log("| CeiLED Controller online |");
console.log("'--------------------------'");