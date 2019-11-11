import React, { createContext, FunctionComponent, Dispatch, useState, SetStateAction } from 'react';

export const CeiledContext = createContext([{}, {}] as [SocketIOClient.Socket | null, Dispatch<SetStateAction<SocketIOClient.Socket | null>>]);

export const CeiledProvider: FunctionComponent = (props) => {
  const [socket, setSocket] = useState<SocketIOClient.Socket | null>(null);
  return (
    <CeiledContext.Provider value={[socket, setSocket]}>
      {props.children}
    </CeiledContext.Provider>
  )
}
