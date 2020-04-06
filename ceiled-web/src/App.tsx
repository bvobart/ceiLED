import React from 'react';
import { Container, Grid, useMediaQuery, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import Header from './components/Header';
import Footer from './components/Footer';
import ErrorDialog from './components/ErrorDialog';
import GlobalControls from './controls/GlobalControls';
import MoodControls from './controls/MoodControls';
import SolidControls from './controls/SolidControls';
import AnimationControls from './controls/AnimationControls';
import { SocketProvider } from './hooks/context/SocketContext';
import { StatusProvider } from './hooks/context/StatusContext';

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
    }
  },
  solids: {
    marginTop: '8px',
    [theme.breakpoints.up('lg')]: {
      marginLeft: '8px',
      marginRight: '8px',
    }
  },
  moods: {
    marginTop: '8px',
    [theme.breakpoints.up('lg')]: {
      marginRight: '8px',
    }
  },
  animations: {
    marginTop: '8px',
    [theme.breakpoints.up('lg')]: {
      marginRight: '8px',
    }
  },
  footer: {
    minWidth: '400px',
    marginTop: '8px',
    [theme.breakpoints.up('lg')]: {
      marginLeft: '8px',
      marginRight: '8px',
    }
  }
}));

const App = () => {
  const classes = useStyles();
  const isMedium = useMediaQuery<Theme>(theme => theme.breakpoints.up('md'));
  const isLarge = useMediaQuery<Theme>(theme => theme.breakpoints.up('lg'));

  return (
    <SocketProvider>
      <StatusProvider>
        <Container className={classes.root} disableGutters maxWidth={isMedium && !isLarge ? 'md' : false}>
          <ErrorDialog />

          <Grid className={classes.main} container>
            <Grid container item xs={12} lg={6} alignContent='flex-start'>
              <Grid item xs={12} className={classes.header}>
                <Header />
                <GlobalControls />
              </Grid>
              <Grid className={classes.solids} item xs={12}><SolidControls expanded={isLarge} /></Grid>
              {isLarge && <Grid item xs={12}><Footer className={classes.footer}/></Grid>}
            </Grid>

            <Grid container item xs={12} lg={6} alignContent='flex-start'>
              <Grid className={classes.moods} item xs={12}><MoodControls expanded={isLarge} /></Grid>
              <Grid className={classes.animations} item xs={12}><AnimationControls expanded={isLarge} /></Grid>
            </Grid>

            {!isLarge && <Grid item xs={12}><Footer className={classes.footer}/></Grid>}
          </Grid>
          
        </Container>
      </StatusProvider>
    </SocketProvider>
  );
}

export default App;
