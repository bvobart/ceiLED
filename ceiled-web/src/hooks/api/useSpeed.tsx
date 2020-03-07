import { useState, useCallback, useEffect } from "react";
import { Events } from "../../api";
import { SetSettingRequest, GetSettingRequest } from '../../api/requests';
import useAuthToken from "./useAuthToken";
import useCeiledSocket from './useCeiledSocket';

const useSpeed = (): [number, (newSpeed: number) => void] => { // hehe, use speed :P
  const [speed, setSpeed] = useState(30); // BPM
  const [socket] = useCeiledSocket();
  const authToken = useAuthToken();

  useEffect(() => {
    if (socket) {
      // if a new socket connection is made, register event listener
      socket.on(Events.SPEED, (newSpeed: number) => setSpeed(newSpeed));
      // and ask for latest speed value
      const request: GetSettingRequest = { authToken, action: 'get' };
      socket.emit(Events.SPEED, request);
    }
  }, [socket, authToken]);

  const updateSpeed = useCallback((newSpeed: number) => {
    if (socket) {
      const request: SetSettingRequest<number> = { authToken, action: 'set', value: newSpeed };
      socket.emit(Events.SPEED, request);
    }
    setSpeed(newSpeed);
  }, [socket, setSpeed, authToken]);

  return [speed, updateSpeed];
}

export default useSpeed;
