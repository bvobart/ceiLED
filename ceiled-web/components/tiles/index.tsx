import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import EditIcon from '@mui/icons-material/EditOutlined';
import { Button, Grid, IconButton } from '@mui/material';
import React, { CSSProperties, forwardRef, FunctionComponent, PropsWithChildren, useState } from 'react';
import { HSVColor } from '../../api/colors';
import ColorPicker from '../colorpicking/ColorPicker';

const minHeight = '48px';

const iconStyles = {
  // TODO: set the colour of the icon based on the pattern's colour so that the icons are always visible
  color: 'rgba(255, 255, 255, 0.7)',
};

export interface EditableTileProps {
  className?: string;
  hsv: HSVColor;
  onEditStart?: () => void;
  onEditConfirm: (color: HSVColor) => void;
  onDelete: () => void;
  style?: CSSProperties;
}

export const EditableTile: FunctionComponent<EditableTileProps> = props => {
  const { className, hsv: initialHSV, onEditConfirm, onEditStart, onDelete } = props;
  const [editing, setEditing] = useState(false);
  const [hsv, setHSV] = useState(initialHSV);

  const onEdit = () => {
    setEditing(true);
    onEditStart && onEditStart();
  };

  const onConfirm = (color: HSVColor) => {
    setEditing(false);
    onEditConfirm(color);
  };

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
      <ColorPicker hsv={hsv} onChange={setHSV} />
      <Button
        fullWidth
        variant='outlined'
        onClick={() => onConfirm(hsv)}
        style={{ minHeight, marginTop: '4px', background: hsv.toCSS() }}
      >
        Confirm
      </Button>
    </div>
  ) : (
    <Tile className={className} hsv={hsv} style={props.style}>
      <Grid container justifyContent='flex-end' alignItems='center' sx={{ minHeight, marginRight: '8px' }}>
        <IconButton size='small' onClick={onEdit}>
          <EditIcon sx={iconStyles} />
        </IconButton>
        <IconButton size='small' onClick={onDelete}>
          <DeleteIcon sx={iconStyles} />
        </IconButton>
      </Grid>
    </Tile>
  );
};

//----------------------------------------------------------------------------------------

export interface TileProps {
  className?: string;
  hsv: HSVColor;
  style?: CSSProperties;
}

export const Tile = React.memo(
  forwardRef<HTMLDivElement, PropsWithChildren<TileProps>>((props, ref) => {
    const { className, children, hsv, style } = props;
    const background = hsv ? hsv.toCSS() : 'rgba(0, 0, 0, 0)';
    return (
      <div ref={ref} className={className} style={{ ...style, background }}>
        {children}
      </div>
    );
  }),
);
Tile.displayName = 'Tile';
