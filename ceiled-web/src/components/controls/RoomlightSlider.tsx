import React, { useState } from 'react';
import { Grid, Typography, Slider } from '@material-ui/core';

interface RoomlightSliderProps {
  className?: string
}

const RoomlightSlider = (props: RoomlightSliderProps) => {
  const [roomlight, setRoomlight] = useState(0);
  // TODO: change to useCeiled or so

  return (
    <Grid container item className={props.className} alignItems='center'>
      <Grid item xs={12} sm={2}>
        <Typography variant='caption'>Roomlight: {roomlight}%</Typography>
      </Grid>
      <Grid item xs={12} sm={10}>
        <Slider
          value={roomlight}
          onChange={(_, newRoomlight) => setRoomlight(newRoomlight as number)}
          min={0}
          max={100}
          step={1}
        />
      </Grid>
    </Grid>
  )
}

export default RoomlightSlider;
