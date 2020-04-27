import React from 'react';
import { Grid, Typography, Slider } from '@material-ui/core';
import useSpeed from '../../hooks/api/useSpeed';

interface SpeedSliderProps {
  className?: string
}

const SpeedSlider = (props: SpeedSliderProps) => {
  const [speed, setSpeed] = useSpeed();

  // TODO: allow speed input through textbox

  return (
    <Grid container item className={props.className} alignItems='center' justify='space-between'>
      <Grid container item xs={6} sm={2} justify='space-between'>
        <Grid item xs={3} sm={1}><Typography variant='caption'>Speed</Typography></Grid>
        <Grid item xs={3} sm={1}><Typography variant='caption' noWrap>{speed} BPM</Typography></Grid>
      </Grid>
      <Grid item xs={12} sm={9}>
        <Slider
          value={speed}
          onChange={(_, newSpeed) => speed !== newSpeed && setSpeed(newSpeed as number)}
          min={2}
          max={300}
          step={1}
        />
      </Grid>
    </Grid>
  )
}

export default SpeedSlider;
