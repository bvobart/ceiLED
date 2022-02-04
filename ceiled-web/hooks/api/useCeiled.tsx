import { useCallback } from 'react';
import { io } from 'socket.io-client';
import { CeiledStatus, Events } from '../../api';
import useAuthToken from './useAuthToken';
import useCeiledSocket, { isConnected } from './useCeiledSocket';
import useCeiledStatus from './useCeiledStatus';

const useCeiled = (): [CeiledStatus, (address: string) => Promise<void>, () => Promise<void>] => {
  const [socket, setSocket] = useCeiledSocket();
  const [status, setStatus] = useCeiledStatus();
  const authToken = useAuthToken();

  const connect = useCallback(
    async (address: string): Promise<void> => {
      if ([CeiledStatus.CONNECTED, CeiledStatus.CONNECTING].includes(status)) {
        return;
      }

      console.log('> Connecting to CeiLED API...');

      const newSocket = io(address, { reconnectionAttempts: 5 });
      newSocket.on(Events.CONNECT, () => {
        console.log('> Connected!');
        if (socket) socket.close();
        setSocket(newSocket);
        setStatus(CeiledStatus.CONNECTED);
      });
      newSocket.on(Events.CONNECT_ERROR, () => {
        console.log('> Connection Error!');
        if (socket) socket.close();
        setStatus(CeiledStatus.ERROR);
        setSocket(null);
      });
      newSocket.on(Events.DISCONNECT, (reason: string) => {
        console.log('> Disconnected: ', reason);
        if (socket) socket.close();
        setStatus(CeiledStatus.DISCONNECTED);
        setSocket(null);
      });

      setSocket(newSocket);
      setStatus(CeiledStatus.CONNECTING);
    },
    [status, socket, setSocket, setStatus],
  );

  const off = useCallback(async (): Promise<void> => {
    if (isConnected(socket)) {
      socket.emit(Events.CEILED, { action: 'off', authToken });
      socket.close();
    }

    setStatus(CeiledStatus.DISCONNECTED);
    setSocket(null);
  }, [authToken, socket, setSocket, setStatus]);

  return [status, connect, off];
};

export default useCeiled;
