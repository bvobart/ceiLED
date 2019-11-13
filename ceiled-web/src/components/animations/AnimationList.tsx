import React, { useState, FunctionComponent } from 'react';
import { List, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { HSVColor } from '../color-picking/colors';
import ColorPicker from '../color-picking/ColorPicker';
import { Animation } from '.';
import DraggableTile from './DraggableTile';

export interface AnimationListProps {
  className?: string;
  channel?: number;
  animation: Animation;
  onChange: (anim: Animation) => void;
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
    marginTop: '8px',
  },
  tile: {
    minHeight: '48px',
    width: '100%',
  }
});

const AnimationList: FunctionComponent<AnimationListProps> = (props) => {
  const classes = useStyles();
  const [adding, setAdding] = useState<boolean>(false);

  // TODO: make it possible to set transitions between colours
  // TODO: allow tiles to be edited / removed
  // TODO: refactor this code so it is actually readable again

  const onAddConfirm = (color: HSVColor) => {
    props.onChange([...props.animation, color]);
    setAdding(false);
  };

  return (
    <div className={props.className} key={`animation-list-${props.channel}`}>
      <List disablePadding>
        {
          props.animation.map((color: HSVColor, index) => (
            <DraggableTile 
              key={`li-${props.channel}-${index}`} 
              index={((props.channel || 0) + 1) * 1000 + index}
              hsv={color}
              className={classes.tile}
            />
          ))
        }
        {props.children}
      </List>
      { 
        adding 
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
    <Button className={classes.button} variant='outlined' onClick={() => props.onConfirm(selectedColor)}
      style={{ background: selectedColor.toCSS() }}
    >
      Confirm
    </Button>
    <ColorPicker className={classes.picker} hsv={selectedColor} onChange={setSelectedColor} />
  </>)
}

export default AnimationList;
