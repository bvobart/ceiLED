import { useCallback, useEffect, useContext } from 'react';
import { Events } from '../../api';
import { SetSettingRequest, GetSettingRequest } from '../../api/requests';
import { BrightnessContext } from '../context/BrightnessContext';
import useAuthToken from './useAuthToken';
import useCeiledSocket from './useCeiledSocket';

const useBrightness = (): [number, (newBrightness: number) => void] => {
  const [brightness, setBrightness] = useContext(BrightnessContext);
  const [socket] = useCeiledSocket();
  const authToken = useAuthToken();

  useEffect(() => {
    // if a new socket connection is made
    if (socket) {
      // register brightness event listener
      socket.on(Events.BRIGHTNESS, (newBrightness: number) => {
        setBrightness(newBrightness);
      });

      // and ask for latest brightness value
      const request: GetSettingRequest = { authToken, action: 'get' };
      socket.emit(Events.BRIGHTNESS, request);
    }
  }, [socket, setBrightness, authToken]);

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
