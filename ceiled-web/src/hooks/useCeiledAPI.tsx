import useCeiledSocket from './useCeiledSocket';
import useAuthToken from './useAuthToken';
import { useEffect, useState, useCallback } from 'react';
import { Events } from '../api';
import { Pattern, PatternType, Solid, FadeLinear, FadeSigmoid, Animation } from '../components/animations';
import { HSVColor, RGBColor, isRGBList } from '../components/color-picking/colors';
import { GetPatternRequest, SetPatternRequest, SetPatternsRequest, SetAnimationsRequest } from '../api/requests';

const defaultPattern = new Solid(HSVColor.random(), 1);

interface CeiledAPI {
  getPattern(channel: number | 'all'): void;
  setPattern(channel: number | 'all', pattern: Pattern): void;
  setPatterns(patterns: Map<number, Pattern>): void;
  setAnimations(animations: Map<number, Animation>): void;
}

const useCeiledAPI = (): [Pattern, CeiledAPI] => {
  // TODO: change this to be a map of patterns. But is it possible to JSON.parse and decode easily?
  const lastActivePattern = decodePattern(JSON.parse(localStorage.getItem('lastActivePattern') || '{}'));
  const [pattern, setPattern] = useState(lastActivePattern || defaultPattern);
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
    if (!socket) return;
    const request: SetPatternRequest = { authToken, action: 'set', channel, pattern };
    socket.emit(Events.CEILED, request);
  }, [socket, authToken]);
  
  // SET patterns
  const setPatterns = useCallback((patterns: Map<number, Pattern>) => {
    if (!socket) return;
    const request: SetPatternsRequest = { authToken, action: 'set', patterns };
    socket.emit(Events.CEILED, request);
  }, [socket, authToken]);
  
  // SET animations
  const setAnimations = useCallback((animations: Map<number, Animation>) => {
    if (!socket) return;
    const request: SetAnimationsRequest = { authToken, action: 'set', animations };
    socket.emit(Events.CEILED, request);
  }, [socket, authToken]);
  
  // react to incoming messages about newly set patterns
  useEffect(() => {
    if (socket) {
      // TODO: fix / properly implement this
      // if a new socket connection is made, register event listener
      // socket.on(Events.CEILED, (newPattern: Pattern) => setPattern(newPattern));
      // socket.on(Events.CEILED, (patterns: Map<number, Pattern>) => type check and update current patterns)
      // and ask for latest pattern value
      // getPattern('all');
    }
  }, [socket, authToken]);
  
  return [pattern, { getPattern, setPattern: updatePattern, setPatterns, setAnimations }];
}

const decodePattern = (p: any): Pattern | undefined => {
  if (!Object.values(PatternType).includes(p.type) || typeof p.length !== 'number') {
    return undefined;
  }

  if (p.type === PatternType.SOLID && RGBColor.is(p.color)) {
    return new Solid(p.color, p.length);
  }

  if (p.type === PatternType.FADE_LINEAR && isRGBList(p.colors)) {
    return new FadeLinear(p.colors, p.length);
  }

  if (p.type === PatternType.FADE_SIGMOID && isRGBList(p.colors)) {
    return new FadeSigmoid(p.colors, p.length);
  }

  return undefined;
}

export default useCeiledAPI;