import React from 'react';
import { Card, makeStyles, Typography, IconButton, Grid } from '@material-ui/core';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import { red, green } from '@material-ui/core/colors';

import { CeiledStatus } from '../api';
import config from '../config';
import useCeiled from '../hooks/api/useCeiled';

const useStyles = makeStyles({
  card: {
    minWidth: '400px',
  },
  content: {
    padding: '8px 16px 8px 16px',
  },
  powerIcon: {
    height: '64px',
    width: '64px',
  },
  powerButtonOff: {
    color: red.A400,
  },
  powerButtonOn: {
    color: green.A400,
  }
});

const Header = () => {
  const classes = useStyles();
  const [status, connect, off] = useCeiled();

  return (
    <Card square className={classes.card}>
      <Grid container className={classes.content} justify='space-between' alignItems='center'>
        <Grid item>
          <Typography variant='h5'>CeiLED</Typography>
          <Typography variant='subtitle1'>Controlling LEDs on a ceiling near you</Typography>
        </Grid>
        <IconButton
          color={status !== CeiledStatus.CONNECTED ? 'primary' : 'secondary'}
          classes={{
            colorPrimary: classes.powerButtonOff,
            colorSecondary: classes.powerButtonOn,
          }}
          onClick={() => connect(config.serverAddress)}
          onDoubleClick={() => off()}
        >
          <PowerSettingsNewIcon className={classes.powerIcon} />
        </IconButton>
      </Grid>
    </Card>
  )
}

export default Header;
