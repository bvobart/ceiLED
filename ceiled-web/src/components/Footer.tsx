import React from 'react';
import { Card, Typography, Button, CardContent, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
  card: {
    minWidth: '400px',
  },
});

const Footer = () => {
  const classes = useStyles();
  return (
    <Card square={true} className={classes.card}>
      <CardContent>
        <Grid container justify='space-between' alignItems='center'>
          <Button variant='text'>About</Button>
          <Typography variant='subtitle2'>Status: TODO</Typography>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default Footer;
