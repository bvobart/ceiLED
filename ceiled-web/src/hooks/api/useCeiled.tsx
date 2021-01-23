import { useCallback } from 'react';
import socketIO from 'socket.io-client';
import { CeiledStatus, Events } from '../../api';
import useAuthToken from './useAuthToken';
import useCeiledSocket, { isConnected } from './useCeiledSocket';
import useCeiledStatus from './useCeiledStatus';

const useCeiled = (): [CeiledStatus, (address: string) => Promise<void>, () => Promise<void>] => {
  const [socket, setSocket] = useCeiledSocket();
  const [status, setStatus] = useCeiledStatus();
  const authToken = useAuthToken();

  const connect = useCallback(
    (address: string): Promise<void> => {
      if (status !== CeiledStatus.DISCONNECTED && status !== CeiledStatus.TIMEOUT) {
        return Promise.resolve();
      }

      const newSocket = socketIO(address, { reconnectionAttempts: 5 });
      newSocket.on(Events.CONNECT, () => {
        console.log('connected');
        if (socket) socket.close();
        setSocket(newSocket);
        setStatus(CeiledStatus.CONNECTED);
      });
      newSocket.on(Events.CONNECT_TIMEOUT, () => {
        console.log('timeout');
        if (socket) socket.close();
        setStatus(CeiledStatus.TIMEOUT);
        setSocket(null);
      });
      newSocket.on(Events.RECONNECT_FAILED, () => {
        console.log('reconnect timeout');
        if (socket) socket.close();
        setStatus(CeiledStatus.TIMEOUT);
        setSocket(null);
      });
      newSocket.on(Events.DISCONNECT, () => {
        console.log('disconnected');
        if (socket) socket.close();
        setStatus(CeiledStatus.DISCONNECTED);
        setSocket(null);
      });

      setSocket(newSocket);
      setStatus(CeiledStatus.CONNECTING);
      return Promise.resolve();
    },
    [status, socket, setSocket, setStatus],
  );

  const off = useCallback((): Promise<void> => {
    if (isConnected(socket)) {
      socket.emit(Events.CEILED, { action: 'off', authToken });
      socket.close();
    }

    setStatus(CeiledStatus.DISCONNECTED);
    setSocket(null);
    return Promise.resolve();
  }, [authToken, socket, setSocket, setStatus]);

  return [status, connect, off];
};

export default useCeiled;
