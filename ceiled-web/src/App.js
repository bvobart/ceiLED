import React, { Component } from 'react';
import { CookiesProvider, withCookies } from 'react-cookie';
import compose from 'recompose/compose';
import { theme } from './theme';

import { MuiThemeProvider, withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import withWidth from '@material-ui/core/withWidth';
import { Paper, Slide } from '@material-ui/core';

import ControllerSocketProvider from './context/ControllerSocketProvider';
import Header from './common/Header';
import LEDControls from './common/LEDControls';
import Footer from './common/footer/Footer';
import AboutPage from './about/AboutPage';

const styles = theme => ({
  root: {
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      maxWidth: 960
    }
  }
});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayAbout: false
    }
  }
  
  render() {
    const { classes, cookies } = this.props;
    const { displayAbout } = this.state;
    const isMobile = this.props.width === 'sm' || this.props.width === 'xs' ? window.innerWidth : 960;

    // generate new authorisation token in case it does not exist yet.
    // authToken is a cryptographically secure string of 8 32-bit random integers.
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
          <Slide direction='right' in={!displayAbout}>
            <LEDControls hidden={displayAbout}/>
          </Slide>
          <Slide direction='left' in={displayAbout}>
            <AboutPage hidden={!displayAbout}/>
          </Slide>
          <Footer toggleAboutPage={() => this.setState({ displayAbout: !displayAbout }) }/>
        </ControllerSocketProvider>
      </Paper>
    )
  }
}

const StyledApp = compose(withStyles(styles), withWidth(), withCookies)(App);
const CompleteStyledApp = () => 
  <CookiesProvider>
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <StyledApp />
    </MuiThemeProvider>
  </CookiesProvider>
;

export default CompleteStyledApp;
