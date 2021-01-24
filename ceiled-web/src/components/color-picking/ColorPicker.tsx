import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core';
import { HSVColor } from './colors';
import { Tile } from '../tiles';
import Hue from './HueSlider';
import Saturation from './Saturation';
import { ColorContext, ColorProvider } from '../../hooks/context/ColorContext';

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

/**
 * Color picker used all throughout CeiLED.
 */
const ColorPicker = (props: ColorPickerProps): JSX.Element => {
  const classes = useStyles();

  return (
    <ColorProvider color={props.hsv}>
      <div className={props.className}>
        <Hue className={classes.hue} />
        {props.preview && <PreviewTile className={classes.preview} />}
        <Saturation className={classes.saturation} />
      </div>
    </ColorProvider>
  );
};

const PreviewTile = (props: { className?: string }) => {
  const [hsv] = useContext(ColorContext);
  return <Tile className={props.className} hsv={hsv}></Tile>;
};

export default ColorPicker;
