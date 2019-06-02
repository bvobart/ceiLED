import React, { Component } from 'react';
import { withStyles, Card, CardHeader, CardContent, Link, Typography, TextField } from '@material-ui/core';

import logo from './ceiled-logo.svg';

const styles = theme => ({
  root: {},
  content: {
    [theme.breakpoints.up('sm')]: {
      display: 'flex',
      justifyContent: 'space-between'
    }
  },
  logo: {
    marginLeft: '16px',
    [theme.breakpoints.down('xs')]: {
      display: 'block',
      width: '80%',
      marginLeft: 'auto',
      marginRight: 'auto',
    }
  },
  tokenField: {
    width: '100%'
  }
})

class AboutPage extends Component {
  render() {
    const { classes, hidden } = this.props;
    if (hidden) return (<div />)
    return (
      <Card className={classes.root}>
        <CardHeader title='About' />
        <CardContent >
          <div className={classes.content}>
            <Typography component='p' align='justify' gutterBottom>
              CeiLED is a suite of software that I created to control the LED strips that I have on
              my ceiling. It consists of this web interface as well as a controller in the form of
              a TypeScript NodeJS application that hosts the CeiLED API over a WebSocket connection.
              <br /><br />
              CeiLED's logo is designed after the way the LED strips are attached to my ceiling.
              The three prongs seen in the logo correspond with the three channels that colours can
              be applied to in this application.
              <br /><br />
              The source code of CeiLED is open source and can be found <Link href='https://github.com/bvobart/ceiLED'>on GitHub</Link>.
              Want to use CeiLED in your own home? Let me know and I can help you set it up ;)
            </Typography>
            <img className={classes.logo} src={logo} alt='CeiLED logo' />
          </div>
          <div>
            <Typography variant='h5'>Security & authorisation</Typography>
            <br />
            <Typography component='p' align='justify' gutterBottom>
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
              value={localStorage.getItem('authToken')} 
            />
          </div>
        </CardContent>
      </Card>
    );
  }
}

export default withStyles(styles)(AboutPage);
