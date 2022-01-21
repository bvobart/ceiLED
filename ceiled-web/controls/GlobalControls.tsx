import { Card, Grid } from '@mui/material';
import React from 'react';
import BrightnessSlider from '../components/global/BrightnessSlider';
import FluxSlider from '../components/global/FluxSlider';
import RoomlightSlider from '../components/global/RoomlightSlider';

const borderRadius = '0px 0px 4px 4px';
const padding = '8px 24px 16px 16px';

const GlobalControls = (): JSX.Element => {
  return (
    <Card sx={{ borderRadius, padding }}>
      <Grid container justifyContent='space-between' alignItems='center' spacing={1}>
        <BrightnessSlider />
        <RoomlightSlider />
        <FluxSlider />
      </Grid>
    </Card>
  );
};

export default GlobalControls;
