import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core';
import { HSVColor, RGBColor } from './colors';
import Hue from './HueSlider';
import Saturation from './Saturation';

interface ColorPickerProps {
  className: string
  onChange?: (color: RGBColor) => void
}

const useStyles = makeStyles({
  preview: {
    height: '48px',
  },
  saturation: {
    height: '196px',
  },
  hue: {
    height: '24px',
    marginBottom: '8px',
  },
});

const ColorPicker = (props: ColorPickerProps) => {
  const classes = useStyles();
  const [hsv, setHSV] = useState<HSVColor>(new HSVColor({ h: 0, s: 0.5, v: 1 }));
  
  // TODO: set initial HSV value from props
  // TODO: implement calling onChange when hsv changes.

  return (
    <div className={props.className}>
      <Hue className={classes.hue} hsv={hsv} onChange={setHSV} />
      <div className={classes.preview} style={{ background: hsv.toCSS() }}/>
      <Saturation className={classes.saturation} hsv={hsv} onChange={setHSV} />
    </div>
  )
}

export default ColorPicker;
