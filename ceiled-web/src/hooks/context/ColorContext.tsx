import React, { createContext, FC, Dispatch, useState, SetStateAction } from 'react';
import { HSVColor } from '../../components/color-picking/colors';

export const ColorContext = createContext([new HSVColor(), {}] as [HSVColor, Dispatch<SetStateAction<HSVColor>>]);

export interface ColorProviderProps {
  color: HSVColor;
}

export const ColorProvider: FC<ColorProviderProps> = props => {
  const [color, setColor] = useState(props.color);
  return <ColorContext.Provider value={[color, setColor]}>{props.children}</ColorContext.Provider>;
};
