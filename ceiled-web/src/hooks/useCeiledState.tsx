import { useEffect, useState, useCallback } from 'react';
import { Events } from '../api';
import useCeiledSocket from './context/useCeiledSocket';
import { RGBColor, isRGBList } from '../components/color-picking/colors';
import { Pattern, Animation, PatternType, Solid, FadeLinear, FadeSigmoid } from '../components/animations';
import { isPatternArray } from '../api/patterns';

const key = 'ceiledState';

/**
 * useCeiledState keeps track of the current patterns or animations assigned to each channel.
 * This state is persisted in localStorage.
 * @returns [state, setState]
 */
const useCeiledState = (): [Map<number, Pattern | Animation>, (state: Map<number, Pattern | Animation>) => void] => {
  const savedState = decodeSavedState(localStorage.getItem(key) || '[]');
  const [state, setState] = useState(savedState);
  const [socket] = useCeiledSocket();

  useEffect(() => {
    if (socket) {
      socket.on(Events.CEILED, (message: any) => {
        // TODO: handle incoming ceiled message
      });
    }
  }, [socket]);

  const updateState = useCallback((state: Map<number, Pattern | Animation>): void => {
    localStorage.setItem(key, encodeSavedState(state));
    setState(state);
  }, [setState]);

  return [state, updateState];
}

export default useCeiledState;

const encodeSavedState = (state: Map<number, Pattern | Animation>): string => {
  return JSON.stringify(Array.from(state.entries()));
}

const decodeSavedState = (state: string): Map<number, Pattern | Animation> => {
  const saved = new Map<number, any>(JSON.parse(state));
  const res = new Map<number, Pattern | Animation>();
  for (const [key, value] of saved.entries()) {
    const pattern = decodePattern(value);
    if (pattern) res.set(key, pattern);
  }

  return res;
}

const decodePattern = (p: any): Pattern | Animation | undefined => {
  if (isPatternArray(p)) {
    return p;
  }

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
