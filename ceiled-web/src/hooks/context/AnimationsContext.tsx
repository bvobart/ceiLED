import React, { createContext, FunctionComponent, Dispatch, useState, SetStateAction, useEffect } from 'react';
import { Animation, IPattern, decodeAnimation } from '../../api/patterns';

const key = 'animations-state';
const numChannels = 3;

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const AnimationsContext = createContext([[], () => {}] as [Animation[], Dispatch<SetStateAction<Animation[]>>]);

export const AnimationsProvider: FunctionComponent = props => {
  const savedState = decodeSavedState(localStorage.getItem(key) || `[${'[],'.repeat(numChannels - 1)}[]]`);
  const [state, setState] = useState<Animation[]>(savedState);

  useEffect(() => {
    // do not save on initial render, it's not necessary
    if (state !== savedState) {
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
