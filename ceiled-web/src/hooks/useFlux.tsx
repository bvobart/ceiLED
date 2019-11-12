import { useState, useCallback, useEffect } from "react";
import { Events } from "../api";
import { SetSettingRequest } from '../api/requests';
import useAuthToken from "./useAuthToken";
import useCeiledSocket from './useCeiledSocket';

const useFlux = (): [number, (newFlux: number) => void] => {
  const [flux, setFlux] = useState(-1);
  const [socket] = useCeiledSocket();
  const authToken = useAuthToken();

  useEffect(() => {
    if (socket) {
      socket.on(Events.FLUX, (newFlux: number) => setFlux(newFlux));
    }
  }, [socket]);

  const updateFlux = useCallback((newFlux: number) => {
    if (socket) {
      const request: SetSettingRequest<number> = { authToken, action: 'set', value: newFlux };
      socket.emit(Events.FLUX, request);
    }
    setFlux(newFlux);
  }, [socket, setFlux, authToken]);

  return [flux, updateFlux];
}

export default useFlux;
