import { useState, useCallback, useEffect } from 'react';
import { Events } from '../../api';
import { SetSettingRequest, GetSettingRequest } from '../../api/requests';
import useAuthToken from './useAuthToken';
import useCeiledSocket from './useCeiledSocket';

const useBrightness = (): [number, (newBrightness: number) => void] => {
  const [brightness, setBrightness] = useState(100);
  const [socket] = useCeiledSocket();
  const authToken = useAuthToken();

  useEffect(() => {
    if (socket) {
      // if a new socket connection is made, register event listener
      socket.on(Events.BRIGHTNESS, (newBrightness: number) => setBrightness(newBrightness));
      // and ask for latest brightness value
      const request: GetSettingRequest = { authToken, action: 'get' };
      socket.emit(Events.BRIGHTNESS, request);
    }
  }, [socket, authToken]);

  const updateBrightness = useCallback(
    (newBrightness: number) => {
      if (socket) {
        const request: SetSettingRequest<number> = { authToken, action: 'set', value: newBrightness };
        socket.emit(Events.BRIGHTNESS, request);
      }
      setBrightness(newBrightness);
    },
    [socket, setBrightness, authToken],
  );

  return [brightness, updateBrightness];
};

export default useBrightness;
