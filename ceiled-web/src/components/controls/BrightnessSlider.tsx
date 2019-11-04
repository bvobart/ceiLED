import React, { useState } from 'react';
import { Grid, Typography, Slider } from '@material-ui/core';

interface BrightnessSliderProps {
  className?: string
}

const BrightnessSlider = (props: BrightnessSliderProps) => {
  const [brightness, setBrightness] = useState(100);
  // TODO: change to useCeiled or so

  return (
    <Grid container item className={props.className} alignItems='center'>
      <Grid item xs={12} sm={2}>
        <Typography variant='caption'>Brightness: {brightness}%</Typography>
      </Grid>
      <Grid item xs={12} sm={10}>
        <Slider
          value={brightness}
          onChange={(_, newBrightness) => setBrightness(newBrightness as number)}
          min={0}
          max={100}
          step={1}
        />
      </Grid>
    </Grid>
  )
}

export default BrightnessSlider;
