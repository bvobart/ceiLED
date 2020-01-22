import { useEffect, useCallback } from 'react';
import { Events, CeiledAPI } from '../api';
import { Animation, Pattern } from '../api/patterns';
import { GetPatternRequest, SetPatternRequest, SetPatternsRequest, SetAnimationsRequest } from '../api/requests';
import useAuthToken from './useAuthToken';
import useCeiledSocket from './context/useCeiledSocket';
import useCeiledState from './useCeiledState';

const useCeiledAPI = (): [Map<number, Pattern | Animation>, CeiledAPI] => {
  const [state, setState] = useCeiledState();
  const [socket] = useCeiledSocket();
  const authToken = useAuthToken();

  // GET pattern
  const getPattern = useCallback((channel: number | 'all') => {
    if (!socket) return;
    const request: GetPatternRequest = { authToken, action: 'get', channel };
    socket.send(Events.CEILED, request);
  }, [socket, authToken]);
  
  // SET pattern
  const updatePattern = useCallback((channel: number | 'all', pattern: Pattern) => {
    if (channel === 'all') {
      const newState = new Map();
      for (const [channel] of state) newState.set(channel, pattern);
      setState(newState);
    } else {
      const newState = new Map(state.entries());
      setState(newState.set(channel, pattern));
    }

    if (!socket) return;
    const request: SetPatternRequest = { authToken, action: 'set', channel, pattern };
    socket.emit(Events.CEILED, request);
  }, [socket, authToken, state, setState]);
  
  // SET patterns
  const setPatterns = useCallback((patterns: Map<number, Pattern>) => {
    setState(patterns);

    if (!socket) return;
    const request: SetPatternsRequest = { authToken, action: 'set', patterns };
    socket.emit(Events.CEILED, request);
  }, [socket, authToken, setState]);
  
  // SET animations
  const setAnimations = useCallback((animations: Map<number, Animation>) => {
    setState(animations);

    if (!socket) return;
    const request: SetAnimationsRequest = { authToken, action: 'set', animations };
    socket.emit(Events.CEILED, request);
  }, [socket, authToken, setState]);
  
  // on newly established socket connection
  useEffect(() => {
    if (socket) {
      // ask for latest pattern value
      getPattern('all');
    }
  }, [socket, getPattern]);
  
  return [state, { getPattern, setPattern: updatePattern, setPatterns, setAnimations }];
}

export default useCeiledAPI;