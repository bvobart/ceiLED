import React, { useState } from 'react';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { SolidPattern } from '../../api/patterns';
import ColorPicker from '../color-picking/ColorPicker';
import { HSVColor, RGBColor } from '../color-picking/colors';

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
  onConfirm: (pattern: SolidPattern) => void
}

const AddSolidPattern = (props: AddSolidPatternProps) => {
  const classes = useStyles();
  const defaultPattern = new SolidPattern(1, new RGBColor({ red: 255, green: 0, blue: 0 }));
  const [pattern, setPattern] = useState<SolidPattern>(defaultPattern);
  
  const onChangeColor = (color: HSVColor) => {
    setPattern(new SolidPattern(pattern.length, color.toRGB()))
  }

  return (<>
    <Button 
      className={classes.button} 
      variant='outlined' 
      onClick={() => props.onConfirm(pattern)}
      style={{ background: pattern.toCSS() }}>Confirm</Button>
    <ColorPicker className={classes.picker} hsv={pattern.color.toHSV()} onChange={onChangeColor} />
  </>)
}

export default AddSolidPattern;
