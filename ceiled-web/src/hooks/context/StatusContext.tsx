import React, { createContext, FunctionComponent, Dispatch, useState, SetStateAction } from 'react';
import { CeiledStatus } from '../../api';

export const StatusContext = createContext([CeiledStatus.DISCONNECTED, {}] as [CeiledStatus, Dispatch<SetStateAction<CeiledStatus>>]);

export const StatusProvider: FunctionComponent = (props) => {
  const [status, setStatus] = useState(CeiledStatus.DISCONNECTED);
  return (
    <StatusContext.Provider value={[status, setStatus]}>
      {props.children}
    </StatusContext.Provider>
  )
}
