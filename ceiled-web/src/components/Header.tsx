import React, { useState } from 'react';
import { Card, makeStyles, Typography, IconButton, Grid } from '@material-ui/core';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import { red, green } from '@material-ui/core/colors';

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
  const [connected, setConnected] = useState(false);

  // TODO: add CeiLED functionality

  return (
    <Card square className={classes.card}>
      <Grid container className={classes.content} justify='space-between' alignItems='center'>
        <Grid item>
          <Typography variant='h5'>CeiLED</Typography>
          <Typography variant='subtitle1'>Controlling LEDs on a ceiling near you</Typography>
        </Grid>
        <IconButton
          color={!connected ? 'primary' : 'secondary'}
          classes={{
            colorPrimary: classes.powerButtonOff,
            colorSecondary: classes.powerButtonOn,
          }}
          onClick={() => setConnected(!connected)}
          // TODO: add onDoubleClick to turn off
        >
          <PowerSettingsNewIcon className={classes.powerIcon} />
        </IconButton>
      </Grid>
    </Card>
  )
}

export default Header;