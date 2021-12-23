import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core';
import { HSVColor } from './colors';
import Brightness from './Brightness';
import HueSaturation from './HueSaturation';

interface ColorPickerProps {
  /** CSS classname for the root component */
  className: string;
  /** Initial HSV colour to edit */
  hsv: HSVColor;
  /** Callback that will be called every time the colour changes */
  onChange: (color: HSVColor) => void;
  /** whether to render a colour preview */
  preview?: boolean;
}

const useStyles = makeStyles({
  root: {
    width: '100%',
    height: '100%',
  },
  brightness: {
    margin: '12px 8px 0px 8px',
    width: 'calc(100% - 16px)',
  },
});

// TODO: make double click on channel header copy the current colour to all other channels.

/**
 * Color picker used all throughout CeiLED.
 */
const ColorPicker = (props: ColorPickerProps): JSX.Element => {
  const classes = useStyles();
  const [hsv, setHSV] = useState(props.hsv);

  const onChange = (newColor: HSVColor) => {
    setHSV(newColor);
    props.onChange(newColor);
  };

  const handleChangeHueSaturation = onChange;
  const handleChangeValue = (newValue: number) => {
    const newColor = new HSVColor({ h: hsv.h, s: hsv.s, v: newValue });
    onChange(newColor);
  };

  return (
    <div className={`${classes.root} ${props.className}`}>
      <HueSaturation hue={hsv.h} saturation={hsv.s} value={hsv.v} onChange={handleChangeHueSaturation} />
      <Brightness className={classes.brightness} value={hsv.v} onChange={handleChangeValue} />
    </div>
  );
};

export default ColorPicker;