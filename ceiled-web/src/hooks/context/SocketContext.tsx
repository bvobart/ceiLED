import React, { createContext, FunctionComponent, Dispatch, useState, SetStateAction } from 'react';

export const SocketContext = createContext([{}, {}] as [SocketIOClient.Socket | null, Dispatch<SetStateAction<SocketIOClient.Socket | null>>]);

export const SocketProvider: FunctionComponent = (props) => {
  const [socket, setSocket] = useState<SocketIOClient.Socket | null>(null);
  return (
    <SocketContext.Provider value={[socket, setSocket]}>
      {props.children}
    </SocketContext.Provider>
  )
}
