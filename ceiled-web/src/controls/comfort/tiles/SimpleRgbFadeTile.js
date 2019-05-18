import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withCookies } from 'react-cookie';
import { withStyles } from '@material-ui/core';

import Tile from '../../../common/tiles/Tile';
import { red, green, blue } from '../../../colorpicking/colors';
import CeiledRequestBuilder from '../../../context/CeiledRequestBuilder';
import CeiledPatternOptionsBuilder from '../../../context/CeiledPatternOptionsBuilder';
import { toRgbString } from '../../../common/utils';

const styles = theme => ({
  tile: {
    animation: 'simple-rgb-fade 12s linear infinite',
    width: '100%',
  },
  '@keyframes simple-rgb-fade': {
    '0%': { background: toRgbString(red) },
    '33%': { background: toRgbString(green) },
    '67%': { background: toRgbString(blue) },
    '100%': { background: toRgbString(red) },
  }
});

class SimpleRgbFadeTile extends Component {
  handleClick() {
    const { onClick, cookies } = this.props;
    if (!onClick) return;

    const patternOptions = new CeiledPatternOptionsBuilder()
      .for('fade')
      .setChannels(1)
      .setSpeed(10)
      .build();
    const message = new CeiledRequestBuilder()
      .setType('fade')
      .setColors([ red, green, blue ])
      .setPatternOptions(patternOptions)
      .setAuthToken(cookies.get('authToken'))
      .build();

    onClick(message);
  }
  
  render() {
    const { classes } = this.props;
    return (
      <Tile className={classes.tile} onClick={this.handleClick.bind(this)}>
        Simple rainbow Fade
      </Tile>
    );
  }
}

SimpleRgbFadeTile.propTypes = {
  // this function is called with the generated pattern as argument
  onClick: PropTypes.func
}

export default withStyles(styles)(withCookies(SimpleRgbFadeTile));