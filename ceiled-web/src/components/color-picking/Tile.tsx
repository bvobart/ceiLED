import React, { FunctionComponent } from 'react';
import { HSVColor } from './colors';

export interface TileProps {
  className?: string
  hsv: HSVColor
}

const Tile: FunctionComponent<TileProps> = (props) => {
  const background = props.hsv ? props.hsv.toCSS() : 'rgba(0, 0, 0, 0)';
  return <div className={props.className} style={{ background }}>{props.children}</div>
}

export default Tile;
