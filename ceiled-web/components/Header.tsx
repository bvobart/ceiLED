import { Card, Grid, Theme, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import React from 'react';
import PowerButton from './global/PowerButton';

const useStyles = makeStyles<Theme>(theme => ({
  card: {
    minWidth: '400px',
    borderRadius: 0,
    [theme.breakpoints.up('lg')]: {
      borderTopLeftRadius: '4px',
      borderTopRightRadius: '4px',
    },
  },
  content: {
    padding: '8px 16px 8px 16px',
  },
  power: {
    maxWidth: '96px',
  },
}));

const Header = (): JSX.Element => {
  const classes = useStyles();

  return (
    <Card className={classes.card}>
      <Grid container className={classes.content} justifyContent='space-between' alignItems='center'>
        <Grid item>
          <Typography variant='h5'>CeiLED</Typography>
          <Typography variant='subtitle1'>Controlling LEDs on a ceiling near you</Typography>
        </Grid>
        <PowerButton className={classes.power} />
      </Grid>
    </Card>
  );
};

export default Header;
