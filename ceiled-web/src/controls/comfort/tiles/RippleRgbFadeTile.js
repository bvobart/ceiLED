import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withCookies } from 'react-cookie';
import { withStyles } from '@material-ui/core';

import Tile from '../../../common/tiles/Tile';
import { red, green, blue } from '../../../colorpicking/colors';
import CeiledRequestBuilder from '../../../context/CeiledRequestBuilder';
import CeiledPatternOptionsBuilder from '../../../context/CeiledPatternOptionsBuilder';
import { toRgbStringsList } from '../../../common/utils';

const styles = theme => ({
  tile: {
    animation: 'ripple-rgb-fade 12s linear infinite',
    background: `linear-gradient(to right, ${toRgbStringsList([ red, green, blue, red, green, blue ])})`,
    backgroundSize: '400% 400%',
    width: '100%',
  },
  '@keyframes ripple-rgb-fade': {
    '0%'  : { backgroundPosition: '0% 50%' },
    '100%': { backgroundPosition: '80% 50%' },
  }
});

class RippleRgbFadeTile extends Component {
  handleClick() {
    const { onClick, cookies } = this.props;
    if (!onClick) return;

    const patternOptions = new CeiledPatternOptionsBuilder()
      .for('fade')
      .setSecondaryColors([ blue, red, green ])
      .setTernaryColors([ green, blue, red ])
      .setChannels(3)
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
        Ripple rainbow Fade
      </Tile>
    );
  }
}

RippleRgbFadeTile.propTypes = {
  // this function is called with the generated pattern as argument
  onClick: PropTypes.func
}

export default withStyles(styles)(withCookies(RippleRgbFadeTile));