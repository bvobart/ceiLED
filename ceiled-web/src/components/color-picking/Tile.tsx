import React, { FunctionComponent } from 'react';
import { HSVColor } from './colors';

export interface TileProps {
  className?: string
  hsv: HSVColor
}

const Tile: FunctionComponent<TileProps> = (props) => {
  return <div className={props.className} style={{ background: props.hsv.toCSS() }}>{props.children}</div>
}

export default Tile;
