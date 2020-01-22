import React, { FunctionComponent } from 'react';
import { FadePattern, SolidPattern } from '../../api/patterns';
import Tile from '../color-picking/Tile';

export interface SolidTileProps {
  className?: string;
  pattern: SolidPattern;
} 

export const SolidTile: FunctionComponent<SolidTileProps> = (props) => {
  const { className, pattern } = props;
  return <Tile className={className} hsv={pattern.color.toHSV()}>{props.children}</Tile>
}

export interface FadeTileProps {
  className?: string;
  height: string;
  pattern: FadePattern;
}

export const FadeTile: FunctionComponent<FadeTileProps> = (props) => {
  const { className, pattern } = props;
  const background = pattern.toCSS();
  // TODO: show some distinction between linear and sigmoid, possibly also a switch to swap between the two
  return <div className={className} style={{ background, minHeight: props.height }}>{props.children}</div>
}
