import { Grid, Slider, Typography } from '@material-ui/core';
import React from 'react';
import useBrightness from '../../hooks/api/useBrightness';

interface BrightnessSliderProps {
  className?: string;
}

const BrightnessSlider = (props: BrightnessSliderProps): JSX.Element => {
  const [brightness, setBrightness] = useBrightness();

  return (
    <Grid container item className={props.className} alignItems='center' justifyContent='space-between'>
      <Grid container item xs={6} sm={2} alignItems='center' justifyContent='space-between'>
        <Grid item xs={4} sm={1}>
          <Typography variant='caption'>Brightness</Typography>
        </Grid>
        <Grid item xs={2} sm={1}>
          <Typography variant='caption'>{brightness}%</Typography>
        </Grid>
      </Grid>
      <Grid item xs={12} sm={9}>
        <Slider
          value={brightness}
          onChange={(_, newBrightness) => brightness !== newBrightness && setBrightness(newBrightness as number)}
          min={0}
          max={100}
          step={1}
        />
      </Grid>
    </Grid>
  );
};

export default BrightnessSlider;
