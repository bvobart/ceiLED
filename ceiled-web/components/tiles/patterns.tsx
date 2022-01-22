import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import EditIcon from '@mui/icons-material/EditOutlined';
import { Grid, IconButton } from '@mui/material';
import React, { CSSProperties, FunctionComponent, useState } from 'react';
import { Tile } from '.';
import { FadePattern, Pattern, SolidPattern } from '../../api/patterns';
import EditPattern from '../animations/EditPattern';
import OutlinedBox from './OutlinedBox';

const tileStyles = {
  borderRadius: '4px',
  minHeight: '48px',
  width: '100%',
};

const iconStyles = {
  // TODO: set the colour of the icon based on the pattern's colour so that the icons are always visible
  color: 'rgba(255, 255, 255, 0.7)',
};

//----------------------------------------------------------------------------------------

export interface EditablePatternTileProps {
  pattern: Pattern;
  onEditStart?: () => void;
  onEditConfirm: (pattern: Pattern) => void;
  onDelete: () => void;
}

export const EditablePatternTile: FunctionComponent<EditablePatternTileProps> = props => {
  const { pattern, onEditStart, onEditConfirm, onDelete } = props;
  const [editing, setEditing] = useState(false);

  const onEdit = () => {
    setEditing(true);
    onEditStart && onEditStart();
  };

  const onConfirm = (newPattern: Pattern | undefined) => {
    setEditing(false);
    if (newPattern) onEditConfirm(newPattern);
  };

  return editing ? (
    <OutlinedBox label='Edit pattern'>
      <EditPattern pattern={pattern} onConfirm={onConfirm} />
    </OutlinedBox>
  ) : (
    <PatternTile pattern={pattern}>
      <Grid container justifyContent='flex-end' alignItems='center' sx={{ minHeight: '48px', marginRight: '8px' }}>
        <IconButton size='small' onClick={onEdit}>
          <EditIcon sx={iconStyles} />
        </IconButton>
        <IconButton size='small' onClick={onDelete}>
          <DeleteIcon sx={iconStyles} />
        </IconButton>
      </Grid>
    </PatternTile>
  );
};

//----------------------------------------------------------------------------------------

export interface PatternTileProps {
  pattern: Pattern;
}

export const PatternTile: FunctionComponent<PatternTileProps> = props => {
  const { pattern } = props;

  if (pattern instanceof SolidPattern) {
    return <SolidTile pattern={pattern}>{props.children}</SolidTile>;
  }
  if (pattern instanceof FadePattern) {
    return <FadeTile pattern={pattern}>{props.children}</FadeTile>;
  }

  return <div style={tileStyles}>NONE</div>;
};

//----------------------------------------------------------------------------------------

export interface SolidTileProps extends PatternTileProps {
  pattern: SolidPattern;
  style?: CSSProperties;
}

export const SolidTile: FunctionComponent<SolidTileProps> = props => {
  const { pattern, style } = props;
  // minimum height is the pattern's length times the height of one block, plus the padding normally found in between the blocks.
  const minHeight = `${48 * pattern.length + 8 * (pattern.length - 1)}px`;

  return (
    <Tile hsv={pattern.color.toHSV()} style={{ ...tileStyles, minHeight, ...style }}>
      {props.children}
    </Tile>
  );
};

//----------------------------------------------------------------------------------------

export interface FadeTileProps extends PatternTileProps {
  pattern: FadePattern;
  // direction of the gradient
  direction?: string;
  style?: CSSProperties;
}

export const FadeTile: FunctionComponent<FadeTileProps> = props => {
  const { pattern, direction, style } = props;
  const background = pattern.toCSS(direction);
  // minimum height is the pattern's length times the height of one block, plus the padding normally found in between the blocks.
  const minHeight = `${48 * pattern.length + 8 * (pattern.length - 1)}px`;
  // TODO: show some distinction between linear and sigmoid, possibly also a switch to swap between the two

  const styles = { ...tileStyles, background, minHeight, ...style };
  return <div style={styles}>{props.children}</div>;
};

//----------------------------------------------------------------------------------------
