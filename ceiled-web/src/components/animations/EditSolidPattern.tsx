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
    marginTop: '4px',
  },
});

export interface EditSolidPatternProps {
  pattern?: SolidPattern;
  onConfirm: (pattern: SolidPattern) => void;
}

const key = 'animations-pick-solid';

const EditSolidPattern = (props: EditSolidPatternProps) => {
  const { pattern: initialPattern, onConfirm } = props;
  const classes = useStyles();
  const previousColor = getSavedColor();
  const defaultColor = initialPattern ? initialPattern.color.toHSV() : previousColor;
  const [color, setColor] = useState<HSVColor>(defaultColor);

  const onClickConfirm = () => {
    if (!initialPattern) setSavedColor(color);
    const length = initialPattern ? initialPattern.length : 1;
    onConfirm(new SolidPattern(length, color.toRGB()));
  }

  return (<>
    <ColorPicker className={classes.picker} hsv={color} onChange={setColor} />
    <Button 
      className={classes.button} 
      variant='outlined' 
      onClick={onClickConfirm}
      style={{ background: color.toCSS() }}>Confirm</Button>
  </>)
}

const getSavedColor = (): HSVColor => {
  const saved = localStorage.getItem(key);
  return saved ? new HSVColor(JSON.parse(saved)) : HSVColor.random();
}

const setSavedColor = (color: HSVColor): void => {
  localStorage.setItem(key, JSON.stringify(color));
}

export default EditSolidPattern;
