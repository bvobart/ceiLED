import React, { useContext } from 'react';
import { Slider, makeStyles } from '@material-ui/core';
import { HSVColor } from './colors';
import { ColorContext } from '../../hooks/context/ColorContext';

interface HueProps {
  className?: string;
}

const hueGradient = 'linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)';

const useStyles = makeStyles({
  rail: {
    background: 'rgba(0, 0, 0, 0)',
  },
  track: {
    background: 'rgba(0, 0, 0, 0)',
  },
  thumb: {
    height: '100%',
    width: '6px',
    margin: '-7.5px -3px -7.5px -3px',
  },
});

/**
 * Hue slider. Assumes that it is wrapped in a ColorContext.Provider.
 */
const HueSlider = (props: HueProps): JSX.Element => {
  const classes = useStyles();
  const [hsv, setHSV] = useContext(ColorContext);

  const onChange = (_: React.ChangeEvent<unknown>, newHue: number | number[]) => {
    const newHSV = new HSVColor({ h: (newHue as number) / 360, s: hsv.s, v: hsv.v });
    setHSV(newHSV);
  };

  return (
    <div className={props.className} style={{ background: hueGradient, borderRadius: '4px' }}>
      <Slider
        classes={{ rail: classes.rail, track: classes.track, thumb: classes.thumb }}
        value={hsv.h * 360}
        step={1}
        min={0}
        max={360}
        onChange={onChange}
      />
    </div>
  );
};

export default HueSlider;
