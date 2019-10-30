import React from 'react';
import { Card, CardContent, makeStyles, Typography } from '@material-ui/core';

const useStyles = makeStyles({
  card: {
    minWidth: '300px',
  },
})

// TODO: add on and off button

const Header = () => {
  const classes = useStyles();
  return (
    <Card className={classes.card} square={true}>
      <CardContent>
        <Typography variant='h5'>CeiLED</Typography>
        <Typography variant='subtitle1'>Controlling LEDs on a ceiling near you</Typography>
      </CardContent>
    </Card>
  )
}

export default Header;
