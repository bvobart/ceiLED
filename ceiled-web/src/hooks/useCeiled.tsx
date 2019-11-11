import { useState, useCallback } from 'react';
import socketIO from 'socket.io-client';
import { CeiledStatus, Events } from '../api';
import useAuthToken from './useAuthToken';
import useCeiledSocket from './useCeiledSocket';

const useCeiled = (): [CeiledStatus, (address: string) => Promise<void>, () => Promise<void>] => {
  const [socket, setSocket] = useCeiledSocket();
  const [status, setStatus] = useState(CeiledStatus.DISCONNECTED);
  const authToken = useAuthToken();

  const connect = useCallback((address: string): Promise<void> => {
    if (status !== CeiledStatus.DISCONNECTED && status !== CeiledStatus.TIMEOUT) {
      return Promise.resolve();
    }

    const newSocket = socketIO(address, { reconnectionAttempts: 5 });
    newSocket.on(Events.CONNECT, () => {
      console.log('connected');
      setSocket(newSocket);
      setStatus(CeiledStatus.CONNECTED);
    });
    newSocket.on(Events.CONNECT_TIMEOUT, () => {
      console.log('timeout');
      setStatus(CeiledStatus.TIMEOUT);
      setSocket(null);
    });
    newSocket.on(Events.RECONNECT_FAILED, () => {
      console.log('reconnect timeout');
      setStatus(CeiledStatus.TIMEOUT);
      setSocket(null);
    });
    newSocket.on(Events.DISCONNECT, () => {
      console.log('disconnected');
      setStatus(CeiledStatus.DISCONNECTED);
      setSocket(null);
    });

    // TODO: set some listeners
    setSocket(newSocket);
    setStatus(CeiledStatus.CONNECTING);
    return Promise.resolve();
  }, [status, setSocket]);

  const off = useCallback((): Promise<void> => {
    if (status !== CeiledStatus.CONNECTED || !socket || !socket.connected) {
      return Promise.reject('ceiled is not connected');
    }

    socket.emit('ceiled', { action: 'off', authToken });
    socket.close();
    return Promise.resolve();
  }, [socket, status, authToken]);

  return [status, connect, off];
}

export default useCeiled;
