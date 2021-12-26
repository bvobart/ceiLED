import React, { createContext, Dispatch, FunctionComponent, SetStateAction, useState } from 'react';
import { Socket } from 'socket.io-client';

export const SocketContext = createContext([{}, {}] as [Socket | null, Dispatch<SetStateAction<Socket | null>>]);

export const SocketProvider: FunctionComponent = props => {
  const [socket, setSocket] = useState<Socket | null>(null);
  return <SocketContext.Provider value={[socket, setSocket]}>{props.children}</SocketContext.Provider>;
};
