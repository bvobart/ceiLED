import { useState, useCallback, useEffect } from "react";
import { Events } from "../api";
import { SetSettingRequest, GetSettingRequest } from '../api/requests';
import useAuthToken from "./useAuthToken";
import useCeiledSocket from './useCeiledSocket';

const useRoomlight = (): [number, (newRoomlight: number) => void] => {
  const [roomlight, setRoomlight] = useState(0);
  const [socket] = useCeiledSocket();
  const authToken = useAuthToken();

  useEffect(() => {
    if (socket) {
      // if a new socket connection is made, register event listener
      socket.on(Events.ROOMLIGHT, (newRoomlight: number) => setRoomlight(newRoomlight));
      // and ask for latest roomlight value
      const request: GetSettingRequest = { authToken, action: 'get' };
      socket.emit(Events.ROOMLIGHT, request);
    }
  }, [socket, authToken]);

  const updateRoomlight = useCallback((newRoomlight: number) => {
    if (socket) {
      const request: SetSettingRequest<number> = { authToken, action: 'set', value: newRoomlight };
      socket.emit(Events.ROOMLIGHT, request);
    }
    setRoomlight(newRoomlight);
  }, [socket, setRoomlight, authToken]);

  return [roomlight, updateRoomlight];
}

export default useRoomlight;
