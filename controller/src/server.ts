import { IncomingMessage } from 'http';
import * as WebSocket from 'ws';

import Color from './common/Color';
import { ControllerSettings, DriverType } from './ControllerSettings';
import CeiledMessageHandler from './messages/ceiled/CeiledMessageHandler';
import { CeiledResponse } from './messages/ceiled/CeiledResponse';
import { MessageHandler, OutgoingMessage, StatusType } from './messages/MessageHandler';

import FadePattern, { FadeType } from './patterns/FadePattern';
import SolidPattern from './patterns/SolidPattern';

export const test = process.env.TEST || false;
export const debug = process.argv[2] === 'debug';
export let settings: ControllerSettings = new ControllerSettings({
  brightness: 100,
  roomLight: 0,
  flux: -1,
  driverType: test || debug ? DriverType.DEBUG : DriverType.PCA9685
});

/**
 * Launches the CeiLED Controller server
 */
const launch = (): void => {
  const server = new WebSocket.Server({ port: 6565 });
  const ceiledHandler: CeiledMessageHandler = new CeiledMessageHandler();
  
  const onConnection = (ws: WebSocket, req: IncomingMessage) => {
    const handlers: MessageHandler[] = [];
    const clientIP: string = req.connection.remoteAddress;
    handlers.push(ceiledHandler);
  
    console.log('Client with IP', clientIP, 'connected.');
  
    ws.on('message', (payload: string) => {
      try {
        const message = JSON.parse(payload);
  
        handlers.forEach((handler: MessageHandler) => {
          const response: OutgoingMessage = handler.handle(message);
          ws.emit(JSON.stringify(response));
        });
      } catch (error) {
        console.error("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
        console.error("- Internal error: ", error);
        console.error("-------------------------------");
        const response: CeiledResponse = new CeiledResponse(StatusType.ERROR, [error])
        ws.emit(JSON.stringify(response));
      }
    });
    ws.on('close', () => console.log('Client with IP', clientIP, 'disconnected'));
  }
  
  const onError = (error: Error) => {
    console.log("Error occurred: ", error);
  }
  
  server.on('connection', onConnection);
  server.on('error', onError);
  
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
}

// if launched directly through node, then launch.
if (require.main === module) {
  launch();
}
