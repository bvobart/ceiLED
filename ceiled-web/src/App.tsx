import React from 'react';
import { createMuiTheme, Container } from '@material-ui/core';
import { makeStyles, ThemeProvider } from '@material-ui/styles';
import { deepPurple } from '@material-ui/core/colors';
import Header from './components/Header';
import Footer from './components/Footer';
import ErrorDialog from './components/ErrorDialog';
import GlobalControls from './controls/GlobalControls';
import MoodControls from './controls/MoodControls';
import SolidControls from './controls/SolidControls';
import AnimationControls from './controls/AnimationControls';
import { CeiledProvider } from './hooks/context/CeiledContext';

const useStyles = makeStyles({
  container: {
    padding: 0,
    overflowX: 'hidden',
  },
})

const App = () => {
  const classes = useStyles();
  const theme = createMuiTheme({
    palette: {
      type: 'dark',
      primary: deepPurple,
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CeiledProvider>
        <Container className={classes.container} maxWidth='md'>
          <Header />
          <ErrorDialog />
          <GlobalControls />
          <MoodControls />
          <SolidControls />
          <AnimationControls />
          <Footer />
        </Container>
      </CeiledProvider>
    </ThemeProvider>
  );
}

export default App;
