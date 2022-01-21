import { Container, Grid, Theme, useMediaQuery } from '@mui/material';
import type { NextPage } from 'next';
import Head from 'next/head';
import ErrorDialog from '../components/ErrorDialog';
import Footer from '../components/footer';
import Header from '../components/header';
import AnimationControls from '../controls/AnimationControls';
import GlobalControls from '../controls/GlobalControls';
import MoodControls from '../controls/MoodControls';
import SolidControls from '../controls/SolidControls';
import { withCeiled } from '../hooks/context/withCeiled';

const minWidth = '400px';
const marginTop = '8px';

// style overrides when isLarge
const lgStyles = {
  header: {
    marginTop: '8px',
    marginLeft: '8px',
    marginRight: '8px',
  },
  solids: {
    marginLeft: '8px',
    marginRight: '8px',
  },
  moods: {
    marginRight: '8px',
  },
  animations: {
    marginRight: '8px',
  },
  footer: {
    marginLeft: '8px',
    marginRight: '8px',
  },
};

const Home: NextPage = () => {
  const isMedium = useMediaQuery<Theme>(theme => theme.breakpoints.up('md'));
  const isLarge = useMediaQuery<Theme>(theme => theme.breakpoints.up('lg'));

  return (
    <Container disableGutters maxWidth={isMedium && !isLarge ? 'md' : false} sx={{ overflowX: 'hidden' }}>
      <Head>
        <title>CeiLED Web</title>
        <meta name='description' content='CeiLED Web - Controlling LEDs on a ceiling near you' />
      </Head>

      <ErrorDialog />

      <Grid container sx={{ height: '100%', overflow: 'hidden' }}>
        <Grid container item xs={12} lg={6} alignContent='flex-start'>
          <Grid item xs={12} sx={isLarge ? lgStyles.header : {}}>
            <Header />
            <GlobalControls />
          </Grid>
          <Grid item xs={12} sx={{ marginTop, ...(isLarge ? lgStyles.solids : {}) }}>
            <SolidControls expanded={isLarge} />
          </Grid>
          {isLarge && (
            <Grid item xs={12}>
              <Footer sx={{ minWidth, marginTop, ...(isLarge ? lgStyles.footer : {}) }} />
            </Grid>
          )}
        </Grid>

        <Grid container item xs={12} lg={6} alignContent='flex-start'>
          <Grid item xs={12} sx={{ marginTop, ...(isLarge ? lgStyles.moods : {}) }}>
            <MoodControls expanded={isLarge} />
          </Grid>
          <Grid item xs={12} sx={{ marginTop, ...(isLarge ? lgStyles.animations : {}) }}>
            <AnimationControls expanded={isLarge} />
          </Grid>
        </Grid>

        {!isLarge && (
          <Grid item xs={12}>
            <Footer sx={{ minWidth, marginTop, ...(isLarge ? lgStyles.footer : {}) }} />
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default withCeiled(Home);
