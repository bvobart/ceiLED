import { Button, Card, CardContent, Collapse, Grid, Theme, Typography } from '@mui/material';
import type { SxProps } from '@mui/system';
import React, { useRef, useState } from 'react';
import useCeiled from '../../hooks/api/useCeiled';
import About from '../About';

export interface FooterProps {
  className?: string;
  sx?: SxProps<Theme>;
}

const Footer = (props: FooterProps): JSX.Element => {
  const ref = useRef<HTMLDivElement>(null);
  const [showAbout, setShowAbout] = useState(false);
  const [status] = useCeiled();

  return (
    <Card ref={ref} className={props.className} sx={props.sx}>
      <CardContent>
        <Grid container justifyContent='space-between' alignItems='center'>
          <Button variant='text' onClick={() => setShowAbout(!showAbout)} sx={{ boxShadow: 'none' }}>
            About
          </Button>
          <Typography variant='subtitle2'>Status - {status}</Typography>
        </Grid>
        <Collapse in={showAbout} onEntered={() => ref.current && ref.current.scrollIntoView({ behavior: 'smooth' })}>
          <About />
        </Collapse>
      </CardContent>
    </Card>
  );
};

export default Footer;
