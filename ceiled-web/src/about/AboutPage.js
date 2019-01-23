import React, { Component } from 'react';
import { withCookies } from 'react-cookie';
import compose from 'recompose/compose';
import { withStyles, Card, CardHeader, CardContent, Typography } from '@material-ui/core';

const styles = theme => ({
  root: {}
})

class AboutPage extends Component {
  render() {
    const { classes, cookies, hidden } = this.props;
    if (hidden) return (<div />)
    return (
      <Card className={classes.root}>
        <CardHeader title='About' />
        <CardContent>
          <Typography component='p'>Insert story about what this app is and how to use it etc.</Typography>
          <Typography component='p'>Your authorisation token is:</Typography>
          <Typography component='p'>{cookies.get('authToken')}</Typography>
        </CardContent>
      </Card>
    );
  }
}

export default compose(withStyles(styles), withCookies)(AboutPage);
