import React from 'react';
import { createMuiTheme, Container } from '@material-ui/core';
import { makeStyles, ThemeProvider } from '@material-ui/styles';
import { deepPurple } from '@material-ui/core/colors';
import Header from './components/Header';
import Footer from './components/Footer';
import GlobalControls from './controls/GlobalControls';
import MoodControls from './controls/MoodControls';
import SolidControls from './controls/SolidControls';

const useStyles = makeStyles({
  container: {
    padding: 0,
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
      <Container className={classes.container} maxWidth="md">
        <Header />
        <GlobalControls />
        <MoodControls />
        <SolidControls />
        <Footer />
      </Container>
    </ThemeProvider>
  );
}

export default App;
