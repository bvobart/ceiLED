import { useEffect, useState, useCallback } from 'react';
import { Events, CeiledState } from '../api';
import useCeiledSocket from './context/useCeiledSocket';
import { Pattern, Animation, decodePatternOrAnimation, IPattern } from '../api/patterns';

const key = 'ceiledState';

/**
 * useCeiledState keeps track of the current patterns or animations assigned to each channel.
 * This state is persisted in localStorage.
 * @returns [state, setState]
 */
const useCeiledState = (): [CeiledState, (state: CeiledState) => void] => {
  const savedState = decodeSavedState(localStorage.getItem(key) || '[]');
  const [state, setState] = useState(savedState);
  const [socket] = useCeiledSocket();

  useEffect(() => {
    if (socket) {
      socket.on(Events.CEILED, (message: any) => {
        // TODO: handle incoming ceiled message
        console.log("Incoming message on 'ceiled': ", message);
      });
    }
  }, [socket]);

  const updateState = useCallback((state: CeiledState): void => {
    localStorage.setItem(key, encodeSavedState(state));
    setState(state);
  }, [setState]);

  return [state, updateState];
}

export default useCeiledState;

const encodeSavedState = (state: CeiledState): string => {
  return JSON.stringify(Array.from(state.entries()));
}

const decodeSavedState = (state: string): CeiledState => {
  const saved = new Map<number, IPattern | IPattern[]>(JSON.parse(state));
  const res = new Map<number, Pattern | Animation>();
  for (const [channel, value] of saved.entries()) {
    try {
      res.set(channel, decodePatternOrAnimation(value));
    } catch (ex) {
      console.error(`Error while decoding saved state, channel ${channel}: ${ex}`);
    }
  }

  return res;
}
