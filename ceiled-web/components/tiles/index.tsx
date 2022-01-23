import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import EditIcon from '@mui/icons-material/EditOutlined';
import { Button, Grid, IconButton } from '@mui/material';
import React, { CSSProperties, forwardRef, FunctionComponent, PropsWithChildren, useState } from 'react';
import { HSVColor } from '../../api/colors';
import ColorPicker from '../colorpicking/ColorPicker';

const minHeight = '48px';

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

  const textColor = hsv.textCSS();

  return editing ? (
    <div
      className={className}
      style={{
        borderRadius: '4px',
        border: '1px solid rgba(255, 255, 255, 0.23)',
        padding: '8px',
      }}
    >
      <ColorPicker hsv={hsv} onChange={setHSV} />
      <Button
        fullWidth
        variant='outlined'
        onClick={() => onConfirm(hsv)}
        style={{ minHeight, marginTop: '4px', background: hsv.toCSS(), color: textColor }}
      >
        Confirm
      </Button>
    </div>
  ) : (
    <Tile className={className} hsv={hsv} style={props.style}>
      <Grid container justifyContent='flex-end' alignItems='center' sx={{ minHeight, marginRight: '8px' }}>
        <IconButton size='small' onClick={onEdit}>
          <EditIcon sx={{ color: textColor, opacity: 0.8 }} />
        </IconButton>
        <IconButton size='small' onClick={onDelete}>
          <DeleteIcon sx={{ color: textColor, opacity: 0.7 }} />
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
