import { Grid, IconButton, makeStyles } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/DeleteOutlined';
import EditIcon from '@material-ui/icons/EditOutlined';
import React, { FunctionComponent, useState } from 'react';
import { Tile } from '.';
import { FadePattern, Pattern, SolidPattern } from '../../api/patterns';
import EditPattern from '../animations/EditPattern';
import OutlinedBox from '../global/OutlinedBox';

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
  editTile: {
    minHeight: '48px',
    marginRight: '8px',
  },
  icon: {
    // TODO: set the colour of the icon based on the pattern's colour so that the icons are always visible
    color: 'rgba(255, 255, 255, 0.7)',
  },
  outlined: {
    width: '100%',
    borderRadius: '4px',
    border: '1px solid rgba(255, 255, 255, 0.23)',
    padding: '4px 4px 8px 4px',
  },
});

//----------------------------------------------------------------------------------------

export interface EditablePatternTileProps {
  pattern: Pattern;
  onEditStart?: () => void;
  onEditConfirm: (pattern: Pattern) => void;
  onDelete: () => void;
}

export const EditablePatternTile: FunctionComponent<EditablePatternTileProps> = props => {
  const { pattern, onEditStart, onEditConfirm, onDelete } = props;
  const classes = useStyles();
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
      <Grid className={classes.editTile} container justifyContent='flex-end' alignItems='center'>
        <IconButton size='small' onClick={onEdit}>
          <EditIcon className={classes.icon} />
        </IconButton>
        <IconButton size='small' onClick={onDelete}>
          <DeleteIcon className={classes.icon} />
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
  const classes = useStyles();

  if (pattern instanceof SolidPattern) {
    return <SolidTile pattern={pattern}>{props.children}</SolidTile>;
  }
  if (pattern instanceof FadePattern) {
    return <FadeTile pattern={pattern}>{props.children}</FadeTile>;
  }

  return <div className={classes.solidTile}>NONE</div>;
};

//----------------------------------------------------------------------------------------

export interface SolidTileProps extends PatternTileProps {
  pattern: SolidPattern;
}

export const SolidTile: FunctionComponent<SolidTileProps> = props => {
  const { pattern } = props;
  const classes = useStyles();
  // minimum height is the pattern's length times the height of one block, plus the padding normally found in between the blocks.
  const minHeight = 48 * pattern.length + 8 * (pattern.length - 1);
  return (
    <Tile className={classes.solidTile} hsv={pattern.color.toHSV()} style={{ minHeight: `${minHeight}px` }}>
      {props.children}
    </Tile>
  );
};

//----------------------------------------------------------------------------------------

export interface FadeTileProps extends PatternTileProps {
  pattern: FadePattern;
  // direction of the gradient
  direction?: string;
}

export const FadeTile: FunctionComponent<FadeTileProps> = props => {
  const { pattern, direction } = props;
  const classes = useStyles();
  const background = pattern.toCSS(direction);
  // minimum height is the pattern's length times the height of one block, plus the padding normally found in between the blocks.
  const minHeight = 48 * pattern.length + 8 * (pattern.length - 1);
  // TODO: show some distinction between linear and sigmoid, possibly also a switch to swap between the two
  return (
    <div className={classes.fadeTile} style={{ background, minHeight: `${minHeight}px` }}>
      {props.children}
    </div>
  );
};

//----------------------------------------------------------------------------------------
