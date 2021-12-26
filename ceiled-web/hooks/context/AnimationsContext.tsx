import React, { createContext, Dispatch, FunctionComponent, SetStateAction, useEffect, useState } from 'react';
import { Animation, decodeAnimation, IPattern } from '../../api/patterns';
import { isBrowser } from '../../config';

const key = 'animations-state';
const numChannels = 3;
const defaultState = `[${'[],'.repeat(numChannels - 1)}[]]`;

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const AnimationsContext = createContext([[], () => {}] as [Animation[], Dispatch<SetStateAction<Animation[]>>]);

export const AnimationsProvider: FunctionComponent = props => {
  const savedState = isBrowser() ? localStorage.getItem(key) || defaultState : defaultState;
  const [state, setState] = useState<Animation[]>(decodeSavedState(savedState));

  useEffect(() => {
    // do not save on initial render, it's not necessary
    if (state !== decodeSavedState(savedState)) {
      localStorage.setItem(key, encodeSavedState(state));
    }
  }, [state, savedState]);

  return <AnimationsContext.Provider value={[state, setState]}>{props.children}</AnimationsContext.Provider>;
};

const encodeSavedState = (state: Animation[]): string => {
  return JSON.stringify(state);
};

const decodeSavedState = (state: string): Animation[] => {
  const saved: IPattern[][] = JSON.parse(state);
  return saved.map(decodeAnimation);
};
