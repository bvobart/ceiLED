import React from 'react';
import { Card, Typography, Button, CardContent, Grid } from '@material-ui/core';

const Footer = () => {
  return (
    <Card square={true}>
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
