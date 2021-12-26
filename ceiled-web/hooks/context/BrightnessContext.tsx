import React, { createContext, FC, Dispatch, useState, SetStateAction } from 'react';

export const BrightnessContext = createContext<[number, Dispatch<SetStateAction<number>>]>([100, () => {}]); // eslint-disable-line @typescript-eslint/no-empty-function

export const BrightnessProvider: FC = props => {
  const [brightness, setBrightness] = useState(100);
  return <BrightnessContext.Provider value={[brightness, setBrightness]}>{props.children}</BrightnessContext.Provider>;
};
