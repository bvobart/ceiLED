import React from 'react';
import { Card, Typography, Button, CardContent } from '@material-ui/core';

const Footer = () => {
  return (
    <Card square={true}>
      <CardContent>
        <Typography>Status: TODO</Typography>
        <Button variant='text'>About</Button>
      </CardContent>
    </Card>
  )
}

export default Footer;
