import { useState, useCallback, useEffect } from 'react';
import { Events } from '../../api';
import { SetSettingRequest, GetSettingRequest } from '../../api/requests';
import useAuthToken from './useAuthToken';
import useCeiledSocket from './useCeiledSocket';

const useFlux = (): [number, (newFlux: number) => void] => {
  const [flux, setFlux] = useState(-1);
  const [socket] = useCeiledSocket();
  const authToken = useAuthToken();

  useEffect(() => {
    if (socket) {
      // if a new socket connection is made, register event listener
      socket.on(Events.FLUX, (newFlux: number) => setFlux(newFlux));
      // and ask for latest flux value
      const request: GetSettingRequest = { authToken, action: 'get' };
      socket.emit(Events.FLUX, request);
    }
  }, [socket, authToken]);

  const updateFlux = useCallback(
    (newFlux: number) => {
      if (socket) {
        const request: SetSettingRequest<number> = { authToken, action: 'set', value: newFlux };
        socket.emit(Events.FLUX, request);
      }
      setFlux(newFlux);
    },
    [socket, setFlux, authToken],
  );

  return [flux, updateFlux];
};

export default useFlux;
