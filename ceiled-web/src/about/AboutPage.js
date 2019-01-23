import React, { Component } from 'react';
import { withCookies } from 'react-cookie';
import compose from 'recompose/compose';
import { withStyles, Card, CardHeader, CardContent, Typography, TextField } from '@material-ui/core';

import logo from './ceiled-logo.svg';

const styles = theme => ({
  root: {},
  content: {
    backgroundImage: logo,
    [theme.breakpoints.up('sm')]: {
      display: 'flex',
      justifyContent: 'space-between'
    }
  },
  logo: {
    [theme.breakpoints.down('xs')]: {
      justifySelf: 'center'
    }
  },
  tokenField: {
    width: '100%'
  }
})

class AboutPage extends Component {
  render() {
    const { classes, cookies, hidden } = this.props;
    if (hidden) return (<div />)
    return (
      <Card className={classes.root}>
        <CardHeader title='About' />
        <CardContent >
          <div className={classes.content}>
            <Typography component='p' gutterBottom>
              CeiLED is a suite of software that I created to control the LED strips that I have on
              my ceiling. It consists of this web interface as well as a controller in the form of
              a TypeScript NodeJS application that hosts the CeiLED API over a WebSocket connection.
              <br /><br />
              CeiLED's logo is designed after the way the LED strips are attached to my ceiling.
              The three prongs seen in the logo correspond with the three channels that colours can
              be applied to in this application.
            </Typography>
            <img src={logo} alt='CeiLED logo' />
          </div>
          <br />
          <div>
            <Typography variant='h5'>Security & Authorisation</Typography>
            <br />
            <Typography component='p' gutterBottom>
              Since CeiLED is literally controlling the lighting in my own home, security is very
              important. The way it is currently set up, you may only connect to the controller if
              you are connected to my personal WiFi network. Even then, to actually control the lights
              along with the controller's settings, your authorisation token needs to be registered in
              a database with the controller. To do so, ask me :P 
              <br /><br />
              Your authorisation token is:
            </Typography>
            <TextField 
              className={classes.tokenField} 
              variant='outlined' 
              value={cookies.get('authToken')} 
            />
          </div>
        </CardContent>
      </Card>
    );
  }
}

export default compose(withStyles(styles), withCookies)(AboutPage);
