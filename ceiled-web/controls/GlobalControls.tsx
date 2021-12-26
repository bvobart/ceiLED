import { Card, Grid, makeStyles } from '@material-ui/core';
import React from 'react';
import BrightnessSlider from '../components/global/BrightnessSlider';
import FluxSlider from '../components/global/FluxSlider';
import RoomlightSlider from '../components/global/RoomlightSlider';

const useStyles = makeStyles({
  card: {
    minWidth: '360px', // 400 - padding-left - padding-right
    padding: '8px 24px 16px 16px',
    borderRadius: '0px 0px 4px 4px',
  },
});

const GlobalControls = (): JSX.Element => {
  const classes = useStyles();
  return (
    <Card className={classes.card}>
      <Grid container justifyContent='space-between' alignItems='center' spacing={1}>
        <BrightnessSlider />
        <RoomlightSlider />
        <FluxSlider />
      </Grid>
    </Card>
  );
};

export default GlobalControls;
