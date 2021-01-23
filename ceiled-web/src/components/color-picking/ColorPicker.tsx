import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core';
import { HSVColor } from './colors';
import { Tile } from '../tiles';
import Hue from './HueSlider';
import Saturation from './Saturation';

interface ColorPickerProps {
  className: string;
  hsv: HSVColor;
  onChange: (color: HSVColor) => void;
  preview?: boolean;
}

const useStyles = makeStyles({
  preview: {
    height: '48px',
  },
  saturation: {
    height: '196px',
  },
  hue: {
    height: '30px',
    marginBottom: '8px',
  },
});

const ColorPicker = (props: ColorPickerProps): JSX.Element => {
  const classes = useStyles();
  const [hsv, setHSV] = useState<HSVColor>(props.hsv);
  const { hsv: hsvProp, onChange } = props;
  useEffect(() => {
    if (!hsv.equals(hsvProp)) onChange(hsv);
  }, [hsv, onChange, hsvProp]);

  return (
    <div className={props.className}>
      <Hue className={classes.hue} hsv={hsv} onChange={setHSV} />
      {props.preview && <Tile className={classes.preview} hsv={hsv} />}
      <Saturation className={classes.saturation} hsv={hsv} onChange={setHSV} />
    </div>
  );
};

export default ColorPicker;
