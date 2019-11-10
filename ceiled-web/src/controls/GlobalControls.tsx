import React from 'react';
import { Card, Grid, makeStyles } from '@material-ui/core';
import BrightnessSlider from '../components/global/BrightnessSlider';
import RoomlightSlider from '../components/global/RoomlightSlider';
import FluxSlider from '../components/global/FluxSlider';

const useStyles = makeStyles({
  card: {
    minWidth: '360px', // 400 - padding-left - padding-right
    padding: '8px 24px 16px 16px',
  },
});

const GlobalControls = () => {
  const classes = useStyles();
  return (
    <Card square className={classes.card}>
      <Grid container justify='space-between' alignItems='center' spacing={1}>
        <BrightnessSlider />
        <RoomlightSlider />
        <FluxSlider />
      </Grid>
    </Card>
  )
}

export default GlobalControls;