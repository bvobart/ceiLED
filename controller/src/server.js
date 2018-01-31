import WebSocket from 'ws';

const handleClose = (code, reason, clientIP) => {
    console.log("Connection with " + clientIP + " closed.");
};

const handleMessage = message => {
    console.log("Message received: ", message);
};

const server = new WebSocket.Server({ port: 6565 });
server.on('connection', (ws, req) => {
    const clientIP = req.connection.remoteAddress;
    //console.log("Connection incoming from ", clientIP);

    ws.on('message', handleMessage);
    //ws.on('close', (code, reason) => handleClose(code, reason, clientIP));
});

server.on('error', error => {
    console.log("Error occurred: ", error);
});

console.log('.--------------------------.');
console.log("| CeiLED Controller online |");
console.log(' -------------------------- ');