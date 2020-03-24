import React, { useState, useRef } from 'react';
import { Card, Typography, Button, CardContent, Grid, Collapse } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import About from './About';
import useCeiled from '../hooks/api/useCeiled';

const useStyles = makeStyles({
  about: {
    padding: '16px 0px 0px 0px',
  },
});

export interface FooterProps {
  className?: string;
}

const Footer = (props: FooterProps) => {
  const classes = useStyles();
  const ref = useRef<HTMLDivElement>(null);
  const [showAbout, setShowAbout] = useState(false);
  const [status] = useCeiled();

  return (
    <Card ref={ref} className={props.className}>
      <CardContent>
        <Grid container justify='space-between' alignItems='center'>
          <Button variant='text' onClick={() => setShowAbout(!showAbout)}>About</Button>
          <Typography variant='subtitle2'>Status - {status}</Typography>
        </Grid>
        <Collapse in={showAbout} onEntered={() => ref.current && ref.current.scrollIntoView({ behavior: 'smooth' })}>
          <About className={classes.about} />
        </Collapse>
      </CardContent>
    </Card>
  )
}

export default Footer;
