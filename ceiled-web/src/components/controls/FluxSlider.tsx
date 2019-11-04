import React, { useState } from 'react';
import { Grid, Typography, Slider } from '@material-ui/core';

interface FluxSliderProps {
  className?: string
}

const FluxSlider = (props: FluxSliderProps) => {
  const [flux, setFlux] = useState(-1);
  // TODO: change to useCeiled or so

  return (
    <Grid container item className={props.className} alignItems='center' justify='space-between'>
      <Grid container item xs={6} sm={2} alignItems='center' justify='space-between'>
        <Grid item xs={4} sm={1}>
          <Typography variant='caption'>Flux</Typography>
        </Grid>
        <Grid item xs={2} sm={1}>
          <Typography variant='caption'>{flux === -1 ? 'Auto' : flux}</Typography>
        </Grid>
      </Grid>
      <Grid item xs={12} sm={9}>
        <Slider
          value={flux}
          onChange={(_, newFlux) => setFlux(newFlux as number)}
          min={-1}
          max={5}
          step={1}
        />
      </Grid>
    </Grid>
  )
}

export default FluxSlider;
