import React, { FunctionComponent, useState, CSSProperties } from 'react';
import { makeStyles, Grid, IconButton, Button } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/DeleteOutlined';
import EditIcon from '@material-ui/icons/EditOutlined';
import { HSVColor } from '../color-picking/colors';
import ColorPicker from '../color-picking/ColorPicker';

const useStyles = makeStyles({
  button: {
    width: '100%',
    marginTop: '4px',
    minHeight: '48px',
  },
  editTile: {
    minHeight: '48px',
    marginRight: '8px',
  },
  icon: {
    // TODO: set the colour of the icon based on the pattern's colour so that the icons are always visible
    color: 'rgba(255, 255, 255, 0.7)',
  },
  picker: {

  }
})

export interface EditableTileProps {
  className?: string;
  hsv: HSVColor;
  onEditStart?: () => void;
  onEditConfirm: (color: HSVColor) => void;
  onDelete: () => void;
}

export const EditableTile: FunctionComponent<EditableTileProps> = (props) => {
  const { className, hsv: initialHSV, onEditConfirm, onEditStart, onDelete } = props;
  const [editing, setEditing] = useState(false);
  const classes = useStyles();
  const [hsv, setHSV] = useState(initialHSV);

  const onEdit = () => {
    setEditing(true);
    onEditStart && onEditStart();
  }

  const onConfirm = (color: HSVColor) => {
    setEditing(false);
    onEditConfirm(color);
  }

  return editing ? (
    <div 
      className={className} 
      style={{
        width: 'calc(100% - 10px)',
        borderRadius: '4px',
        border: '1px solid rgba(255, 255, 255, 0.23)',
        padding: '4px 4px 4px 4px',
      }}
    >
      <ColorPicker className={classes.picker} hsv={hsv} onChange={setHSV} />
      <Button 
        className={classes.button} 
        variant='outlined'
        onClick={() => onConfirm(hsv)} 
        style={{ background: hsv.toCSS()}}
      >
        Confirm
      </Button>
    </div>
  ) : (
    <Tile className={className} hsv={hsv}>
      <Grid className={classes.editTile} container justify='flex-end' alignItems='center'>
        <IconButton size='small' onClick={onEdit}><EditIcon className={classes.icon} /></IconButton>
        <IconButton size='small' onClick={onDelete}><DeleteIcon className={classes.icon} /></IconButton>
      </Grid>
    </Tile>
  )
}

//----------------------------------------------------------------------------------------

export interface TileProps {
  className?: string
  hsv: HSVColor
  style?: CSSProperties
}

export const Tile: FunctionComponent<TileProps> = (props) => {
  const { className, children, hsv, style } = props;
  const background = hsv ? hsv.toCSS() : 'rgba(0, 0, 0, 0)';
  return <div className={className} style={{ ...style, background }}>{children}</div>
}
