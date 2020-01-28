import React, { FunctionComponent } from 'react';
import { makeStyles } from '@material-ui/core';
import { FadePattern, SolidPattern, Pattern } from '../../api/patterns';
import Tile from '../color-picking/Tile';

const useStyles = makeStyles({
  solidTile: {
    borderRadius: '4px',
    minHeight: '48px',
    width: '100%',
  },
  fadeTile: {
    borderRadius: '4px',
    width: '100%',
  },
});

//----------------------------------------------------------------------------------------

export interface PatternTileProps {
  pattern: Pattern;
} 

export const PatternTile: FunctionComponent<PatternTileProps> = (props) => {
  const { pattern } = props;
  const classes = useStyles();

  if (pattern instanceof SolidPattern) {
    return <SolidTile pattern={pattern}>{props.children}</SolidTile>
  }
  if (pattern instanceof FadePattern) {
    return <FadeTile pattern={pattern}>{props.children}</FadeTile>
  }

  return <div className={classes.solidTile}>NONE</div>
}

//----------------------------------------------------------------------------------------

export interface SolidTileProps {
  pattern: SolidPattern;
} 

export const SolidTile: FunctionComponent<SolidTileProps> = (props) => {
  const { pattern } = props;
  const classes = useStyles();
  return <Tile className={classes.solidTile} hsv={pattern.color.toHSV()}>{props.children}</Tile>
}

//----------------------------------------------------------------------------------------

export interface FadeTileProps {
  pattern: FadePattern;
}

export const FadeTile: FunctionComponent<FadeTileProps> = (props) => {
  const { pattern } = props;
  const classes = useStyles();
  const background = pattern.toCSS();
  // minimum height is the pattern's length times the height of one block, plus the padding normally found in between the blocks.
  const minHeight = 48 * pattern.length + 8 * (pattern.length - 1);
  // TODO: show some distinction between linear and sigmoid, possibly also a switch to swap between the two
  return <div className={classes.fadeTile} style={{ background, minHeight: `${minHeight}px` }}>{props.children}</div>
}

//----------------------------------------------------------------------------------------
