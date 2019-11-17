import React, { useState } from 'react';
import { Solid } from '.';
import { Button } from '@material-ui/core';
import ColorPicker from '../color-picking/ColorPicker';
import { HSVColor } from '../color-picking/colors';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
  button: {
    width: '100%',
    marginTop: '4px',
    minHeight: '48px',
  },
  picker: {
    minHeight: '276px',
    marginTop: '8px',
  },
});

export interface AddSolidPatternProps {
  onConfirm: (pattern: Solid) => void
}

const AddSolidPattern = (props: AddSolidPatternProps) => {
  const classes = useStyles();
  const defaultPattern = new Solid(new HSVColor({ h: 0, s: 1, v: 1 }), 1);
  const [pattern, setPattern] = useState<Solid>(defaultPattern);
  
  const onChangeColor = (color: HSVColor) => {
    setPattern(new Solid(color, pattern.length))
  }

  return (<>
    <Button 
      className={classes.button} 
      variant='outlined' 
      onClick={() => props.onConfirm(pattern)}
      style={{ background: pattern.toCSS() }}>Confirm</Button>
    <ColorPicker className={classes.picker} hsv={pattern.color} onChange={onChangeColor} />
  </>)
}

export default AddSolidPattern;
