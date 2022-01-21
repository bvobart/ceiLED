import { Card, Grid, Theme, Typography, useMediaQuery } from '@mui/material';
import type { SxProps } from '@mui/system';
import React from 'react';
import { minWidth } from '../../styles/theme';
import PowerButton from '../global/PowerButton';

const borderRadius = 0;

const Header = (): JSX.Element => {
  const isLarge = useMediaQuery<Theme>(theme => theme.breakpoints.up('lg'));

  const styles: SxProps<Theme> = { minWidth, borderRadius };
  if (isLarge) styles.borderRadius = '4px';

  return (
    <Card sx={{ minWidth, borderRadius }}>
      <Grid container justifyContent='space-between' alignItems='center' sx={{ padding: '8px 16px 8px 16px' }}>
        <Grid item>
          <Typography variant='h5'>CeiLED</Typography>
          <Typography variant='subtitle1'>Controlling LEDs on a ceiling near you</Typography>
        </Grid>
        <PowerButton />
      </Grid>
    </Card>
  );
};

export default Header;
