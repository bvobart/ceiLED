import { useCallback } from 'react';
import { Events, CeiledAPI } from '../../api';
import { Animation, Pattern } from '../../api/patterns';
import { GetPatternRequest, SetPatternRequest, SetPatternsRequest, SetAnimationsRequest } from '../../api/requests';
import useAuthToken from './useAuthToken';
import useCeiledSocket from './useCeiledSocket';
import useCeiledState from './useCeiledState';

const useCeiledAPI = (): [Map<number, Pattern | Animation>, CeiledAPI] => {
  const authToken = useAuthToken();
  const [socket] = useCeiledSocket();
  const [state, setState] = useCeiledState();

  // GET pattern
  const getPattern = useCallback((channel: number | 'all') => {
    if (!socket) return;
    const request: GetPatternRequest = { authToken, action: 'get', channel };
    socket.emit(Events.CEILED, request);
  }, [socket, authToken]);
  
  // SET pattern
  const updatePattern = useCallback((channel: number | 'all', pattern: Pattern) => {
    if (!socket) return;
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
  }, [socket, authToken, state, setState]);
  
  // SET patterns
  const setPatterns = useCallback((patterns: Map<number, Pattern>) => {
    if (!socket) return;
    setState(patterns);

    const request: SetPatternsRequest = { authToken, action: 'set', patterns: Array.from(patterns.entries()) };
    socket.emit(Events.CEILED, request);
  }, [socket, authToken, setState]);
  
  // SET animations
  const setAnimations = useCallback((animations: Map<number, Animation>) => {
    if (!socket) return;
    setState(animations);

    const request: SetAnimationsRequest = { authToken, action: 'set', animations: Array.from(animations.entries()) };
    socket.emit(Events.CEILED, request);
  }, [socket, authToken, setState]);
  
  return [state, { getPattern, setPattern: updatePattern, setPatterns, setAnimations }];
}

export default useCeiledAPI;