import React, { useState } from 'react';
import { Card, Typography, Button, CardContent, Grid, Collapse } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import About from './About';

const useStyles = makeStyles({
  card: {
    minWidth: '400px',
  },
  about: {
    padding: '16px 0px 0px 0px',
  },
});

const Footer = () => {
  const classes = useStyles();
  const [showAbout, setShowAbout] = useState(false);

  return (
    <Card square={true} className={classes.card}>
      <CardContent>
        <Grid container justify='space-between' alignItems='center'>
          <Button variant='text' onClick={() => setShowAbout(!showAbout)}>About</Button>
          <Typography variant='subtitle2'>Status: TODO</Typography>
        </Grid>
        <Collapse in={showAbout}>
          <About className={classes.about} />
        </Collapse>
      </CardContent>
    </Card>
  )
}

export default Footer;
