import React from 'react';
import { Grid, Typography, Slider } from '@material-ui/core';
import useRoomlight from '../../hooks/api/useRoomlight';

interface RoomlightSliderProps {
  className?: string
}

const RoomlightSlider = (props: RoomlightSliderProps) => {
  const [roomlight, setRoomlight] = useRoomlight();

  return (
    <Grid container item className={props.className} alignItems='center' justify='space-between'>
      <Grid container item xs={6} sm={2} justify='space-between'>
        <Grid item xs={4} sm={1}>
          <Typography variant='caption'>Roomlight</Typography>
        </Grid>
        <Grid item xs={2} sm={1}>
          <Typography variant='caption'>{roomlight}%</Typography>
        </Grid>
      </Grid>
      <Grid item xs={12} sm={9}>
        <Slider
          value={roomlight}
          onChange={(_, newRoomlight) => roomlight !== newRoomlight && setRoomlight(newRoomlight as number)}
          min={0}
          max={100}
          step={1}
        />
      </Grid>
    </Grid>
  )
}

export default RoomlightSlider;
