import { useCallback } from 'react';
import { Events, CeiledAPI, CeiledStatus } from '../../api';
import { Animation, Pattern } from '../../api/patterns';
import {
  GetPatternRequest,
  SetPatternRequest,
  SetPatternsRequest,
  SetAnimationsRequest,
  SetMoodRequest,
} from '../../api/requests';
import useAuthToken from './useAuthToken';
import useCeiledSocket, { isConnected } from './useCeiledSocket';
import useCeiledState from './useCeiledState';
import { Moods } from '../../api/moods';

const useCeiledAPI = (): [Map<number, Pattern | Animation>, CeiledAPI] => {
  const authToken = useAuthToken();
  const [socket] = useCeiledSocket();
  const [state, setState] = useCeiledState();

  // GET pattern
  const getPattern = useCallback(
    (channel: number | 'all'): Promise<void> => {
      if (isConnected(socket)) {
        const request: GetPatternRequest = { authToken, action: 'get', channel };
        socket.emit(Events.CEILED, request);
        return Promise.resolve();
      }
      return Promise.reject(CeiledStatus.DISCONNECTED);
    },
    [socket, authToken],
  );

  // SET pattern
  const updatePattern = useCallback(
    (channel: number | 'all', pattern: Pattern): Promise<void> => {
      if (isConnected(socket)) {
        if (channel === 'all') {
          const newState = new Map();
          for (const [channel] of state) newState.set(channel, pattern);
          setState(newState);
        } else {
          const newState = new Map(state.entries());
          setState(newState.set(channel, pattern));
        }

        const request: SetPatternRequest = { authToken, action: 'set', channel, pattern };
        socket.emit(Events.CEILED, request);
        return Promise.resolve();
      }
      return Promise.reject(CeiledStatus.DISCONNECTED);
    },
    [socket, authToken, state, setState],
  );

  // SET patterns
  const setPatterns = useCallback(
    (patterns: Map<number, Pattern>): Promise<void> => {
      if (isConnected(socket)) {
        setState(patterns);
        const request: SetPatternsRequest = { authToken, action: 'set', patterns: Array.from(patterns.entries()) };
        socket.emit(Events.CEILED, request);
        return Promise.resolve();
      }
      return Promise.reject(CeiledStatus.DISCONNECTED);
    },
    [socket, authToken, setState],
  );

  // SET animations
  const setAnimations = useCallback(
    (animations: Map<number, Animation>): Promise<void> => {
      if (isConnected(socket)) {
        setState(animations);
        const request: SetAnimationsRequest = {
          authToken,
          action: 'set',
          animations: Array.from(animations.entries()),
        };
        socket.emit(Events.CEILED, request);
        return Promise.resolve();
      }
      return Promise.reject(CeiledStatus.DISCONNECTED);
    },
    [socket, authToken, setState],
  );

  // SET mood
  const setMood = useCallback(
    (mood: Moods): Promise<void> => {
      if (isConnected(socket)) {
        const request: SetMoodRequest = { authToken, action: 'set', mood };
        socket.emit(Events.CEILED, request);
        return Promise.resolve();
      }
      return Promise.reject(CeiledStatus.DISCONNECTED);
    },
    [socket, authToken],
  );

  return [state, { getPattern, setPattern: updatePattern, setPatterns, setAnimations, setMood }];
};

export default useCeiledAPI;
