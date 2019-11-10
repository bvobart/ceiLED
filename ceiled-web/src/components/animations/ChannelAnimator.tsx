import React, { useState } from 'react';
import { List, ListItem, Button, Typography, Divider } from '@material-ui/core';
import { HSVColor } from '../color-picking/colors';
import Tile from '../color-picking/Tile';
import { makeStyles } from '@material-ui/styles';
import ColorPicker from '../color-picking/ColorPicker';

interface ChannelAnimatorProps {
  className?: string;
  channel: number;
}

const useStyles = makeStyles({
  button: {
    width: '100%',
    marginTop: '4px',
    minHeight: '48px',
  },
  label: {
    width: '100%',
  },
  picker: {
    minHeight: '276px',
    marginTop: '4px',
  },
  tile: {
    minHeight: '48px',
    width: '100%',
  }
})

const ChannelAnimator = (props: ChannelAnimatorProps) => {
  const classes = useStyles();
  const [colors, setColors] = useState<HSVColor[]>([]);
  const [adding, setAdding] = useState<boolean>(false);
  
  // TODO: make it possible to set transitions between colours
  // TODO: allow tiles to be edited / removed / dragged and dropped
  const colorTiles = colors.map((color, index) => {
    return <ListItem dense disableGutters key={index}><Tile className={classes.tile} hsv={color} /></ListItem>
  });

  const onAddConfirm = (color: HSVColor) => {
    setColors([...colors, color]);
    setAdding(false);
  };

  return (
    <div className={props.className}>
      <Typography gutterBottom className={classes.label} align='center' variant='subtitle1'>Channel {props.channel + 1}</Typography>
      <Divider />
      <List disablePadding>
        {colorTiles}
      </List>
      { adding 
        ? <AddColor onConfirm={onAddConfirm} />
        : <Button className={classes.button} variant='outlined' onClick={() => setAdding(true)}>Add</Button>
      }
    </div>
  )
}

interface AddColorProps {
  onConfirm: (color: HSVColor) => void
}

const AddColor = (props: AddColorProps) => {
  const classes = useStyles();
  const defaultColor = new HSVColor({ h: 0, s: 1, v: 1 });
  const [selectedColor, setSelectedColor] = useState<HSVColor>(defaultColor);
  
  return (<>
    <Button className={classes.button} variant='outlined' onClick={() => props.onConfirm(selectedColor)}>
      Confirm
    </Button>
    <ColorPicker className={classes.picker} hsv={selectedColor} onChange={setSelectedColor} />
  </>)
}

export default ChannelAnimator;
