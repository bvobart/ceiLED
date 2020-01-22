import { useEffect, useState, useCallback } from 'react';
import { Events, CeiledState } from '../api';
import useCeiledSocket from './context/useCeiledSocket';
import { Pattern, Animation, decodePatternOrAnimation, IPattern, decodePattern, decodeAnimation } from '../api/patterns';
import { GetPatternRequest } from '../api/requests';
import useAuthToken from './useAuthToken';
import { PatternResponse, PatternsResponse, AnimationsResponse } from '../api/responses';

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
  const authToken = useAuthToken();

  useEffect(() => {
    if (socket) {
      // if a new socket connection is made, register event listener
      socket.on(Events.CEILED, (message: PatternResponse | PatternsResponse | AnimationsResponse) => {
        try {
          if (PatternResponse.is(message)) {
            setState(s => new Map(s.set(message.channel, decodePattern(message.pattern))));
          } else {
            setState(decodeCeiledMessage(message));
          }
        } catch (err) {
          console.error("Error: failed to parse message on 'ceiled':", message);
        }
      });

      // and ask for current state
      const request: GetPatternRequest = { authToken, action: 'get', channel: 'all' };
      socket.emit(Events.CEILED, request);
    }
  }, [socket, authToken]);

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

const decodeCeiledMessage = (message: PatternsResponse | AnimationsResponse): CeiledState => {
  const res = new Map<number, Pattern | Animation>();

  if (PatternsResponse.is(message)) {
    for (const [channel, pattern] of message.patterns) {
      res.set(channel, decodePattern(pattern));
    }
  } else if (AnimationsResponse.is(message)) {
    for (const [channel, patterns] of message.animations) {
      res.set(channel, decodeAnimation(patterns));
    }
  }

  return res;
}