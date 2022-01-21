import { Container, Grid, Theme, useMediaQuery } from '@mui/material';
import { makeStyles } from '@mui/styles';
import type { NextPage } from 'next';
import Head from 'next/head';
import ErrorDialog from '../components/ErrorDialog';
import Footer from '../components/Footer';
import Header from '../components/Header';
import AnimationControls from '../controls/AnimationControls';
import GlobalControls from '../controls/GlobalControls';
import MoodControls from '../controls/MoodControls';
import SolidControls from '../controls/SolidControls';
import { withCeiled } from '../hooks/context/withCeiled';

const useStyles = makeStyles<Theme>(theme => ({
  root: {
    overflowX: 'hidden',
  },
  main: {
    height: '100%',
    overflow: 'hidden',
  },
  header: {
    [theme.breakpoints.up('lg')]: {
      marginTop: '8px',
      marginLeft: '8px',
      marginRight: '8px',
    },
  },
  solids: {
    marginTop: '8px',
    [theme.breakpoints.up('lg')]: {
      marginLeft: '8px',
      marginRight: '8px',
    },
  },
  moods: {
    marginTop: '8px',
    [theme.breakpoints.up('lg')]: {
      marginRight: '8px',
    },
  },
  animations: {
    marginTop: '8px',
    [theme.breakpoints.up('lg')]: {
      marginRight: '8px',
    },
  },
  footer: {
    minWidth: '400px',
    marginTop: '8px',
    [theme.breakpoints.up('lg')]: {
      marginLeft: '8px',
      marginRight: '8px',
    },
  },
}));

const Home: NextPage = () => {
  const classes = useStyles();
  const isMedium = useMediaQuery<Theme>(theme => theme.breakpoints.up('md'));
  const isLarge = useMediaQuery<Theme>(theme => theme.breakpoints.up('lg'));

  return (
    <Container className={classes.root} disableGutters maxWidth={isMedium && !isLarge ? 'md' : false}>
      <Head>
        <title>CeiLED Web</title>
        <meta name='description' content='CeiLED Web - Controlling LEDs on a ceiling near you' />
      </Head>

      <ErrorDialog />

      <Grid className={classes.main} container>
        <Grid container item xs={12} lg={6} alignContent='flex-start'>
          <Grid item xs={12} className={classes.header}>
            <Header />
            <GlobalControls />
          </Grid>
          <Grid className={classes.solids} item xs={12}>
            <SolidControls expanded={isLarge} />
          </Grid>
          {isLarge && (
            <Grid item xs={12}>
              <Footer className={classes.footer} />
            </Grid>
          )}
        </Grid>

        <Grid container item xs={12} lg={6} alignContent='flex-start'>
          <Grid className={classes.moods} item xs={12}>
            <MoodControls expanded={isLarge} />
          </Grid>
          <Grid className={classes.animations} item xs={12}>
            <AnimationControls expanded={isLarge} />
          </Grid>
        </Grid>

        {!isLarge && (
          <Grid item xs={12}>
            <Footer className={classes.footer} />
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default withCeiled(Home);
