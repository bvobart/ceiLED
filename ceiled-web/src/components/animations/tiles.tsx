import React, { FunctionComponent } from 'react';
import { Solid, FadeLinear, FadeSigmoid } from '.';
import Tile from '../color-picking/Tile';

export interface SolidTileProps {
  className?: string;
  pattern: Solid;
} 

export const SolidTile: FunctionComponent<SolidTileProps> = (props) => {
  const { className, pattern } = props;
  return <Tile className={className} hsv={pattern.color}>{props.children}</Tile>
}

export interface FadeLinearTileProps {
  className?: string;
  height: string;
  pattern: FadeLinear;
}

export const FadeLinearTile: FunctionComponent<FadeLinearTileProps> = (props) => {
  const { className, pattern } = props;
  const background = pattern.toCSS();
  return <div className={className} style={{ background, minHeight: props.height }}>{props.children}</div>
}

export interface FadeSigmoidTileProps {
  className?: string;
  height: string;
  pattern: FadeSigmoid;
}

export const FadeSigmoidTile: FunctionComponent<FadeSigmoidTileProps> = (props) => {
  const { className, pattern } = props;
  const background = pattern.toCSS();
  return <div className={className} style={{ background, minHeight: props.height }}>{props.children}</div>
}
