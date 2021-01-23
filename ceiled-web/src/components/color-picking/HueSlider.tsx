import React from 'react';
import { Slider, makeStyles } from '@material-ui/core';
import { HSVColor } from './colors';
import throttle from 'lodash.throttle';

interface HueProps {
  className?: string;
  hsv: HSVColor;
  onChange: (hsv: HSVColor) => void;
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

const HueSlider = (props: HueProps): JSX.Element => {
  const classes = useStyles();

  const onChange = throttle(
    (_: React.ChangeEvent<unknown>, newHue: number | number[]) => {
      const newHSV = new HSVColor({ h: (newHue as number) / 360, s: props.hsv.s, v: props.hsv.v });
      props.onChange(newHSV);
    },
    50,
    { leading: true, trailing: true },
  );

  return (
    <div className={props.className} style={{ background: hueGradient, borderRadius: '4px' }}>
      <Slider
        classes={{ rail: classes.rail, track: classes.track, thumb: classes.thumb }}
        value={props.hsv.h * 360}
        step={1}
        min={0}
        max={360}
        onChange={onChange}
      />
    </div>
  );
};

export default HueSlider;
