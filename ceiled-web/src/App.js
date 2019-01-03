import React, { Component } from 'react';
import { CookiesProvider, withCookies } from 'react-cookie';
import { hot } from 'react-hot-loader';
import compose from 'recompose/compose';
import { theme } from './theme';

import CssBaseline from '@material-ui/core/CssBaseline';
import { MuiThemeProvider, withStyles } from '@material-ui/core/styles';
import withWidth from '@material-ui/core/withWidth';
import Paper from '@material-ui/core/Paper';

import ControllerSocketProvider from './context/ControllerSocketProvider';
import Header from './common/Header';
import LEDControls from './common/LEDControls';
import Footer from './common/Footer';

const styles = theme => ({
  root: {
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      maxWidth: 960
    }
  }
});

class App extends Component {
  render() {
    const { classes, cookies } = this.props;
    const isMobile = this.props.width === 'sm' || this.props.width === 'xs' ? window.innerWidth : 960;

    if (!cookies.get('authToken')) {
      const tokens = new Uint32Array(8);
      crypto.getRandomValues(tokens);
      const authToken = tokens.reduce((token, current) => token += current, "");
      cookies.set('authToken', authToken);
    }
    
    return (
      <Paper className={classes.root} style={{ width: isMobile }}>
        <ControllerSocketProvider>
          <Header />
          <LEDControls />
          <Footer />
        </ControllerSocketProvider>
      </Paper>
    )
  }
}

const StyledApp = compose(withStyles(styles), withWidth(), withCookies)(App);
const HotStyledApp = hot(module)(() => 
  <CookiesProvider>
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <StyledApp />
    </MuiThemeProvider>
  </CookiesProvider>
);

export default HotStyledApp;
