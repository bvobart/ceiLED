import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withCookies } from 'react-cookie';
import { withStyles } from '@material-ui/core';

import Tile from '../../../common/tiles/Tile';
import { red, orangeYellow, chocolate } from '../../../colorpicking/colors';
import CeiledRequestBuilder from '../../../context/CeiledRequestBuilder';
import CeiledPatternOptionsBuilder from '../../../context/CeiledPatternOptionsBuilder';
import { toRgbStringsList } from '../../../common/utils';

const styles = theme => ({
  tile: {
    animation: 'ripple-warm-fade 12s linear infinite',
    background: `linear-gradient(to right, ${toRgbStringsList([ red, chocolate, orangeYellow, red, chocolate, orangeYellow ])})`,
    backgroundSize: '400% 400%',
    width: '100%',
  },
  '@keyframes ripple-warm-fade': {
    '0%'  : { backgroundPosition: '0% 50%' },
    '100%': { backgroundPosition: '80% 50%' },
  }
});

class RippleWarmFadeTile extends Component {
  handleClick() {
    const { onClick, cookies } = this.props;
    if (!onClick) return;

    const patternOptions = new CeiledPatternOptionsBuilder()
      .for('fade')
      .setSecondaryColors([ chocolate, orangeYellow, red ])
      .setTernaryColors([ red, chocolate, orangeYellow ])
      .setChannels(3)
      .setSpeed(10)
      .build();
    const message = new CeiledRequestBuilder()
      .setType('fade')
      .setColors([ red, chocolate, orangeYellow ])
      .setPatternOptions(patternOptions)
      .setAuthToken(cookies.get('authToken'))
      .build();

    onClick(message);
  }
  
  render() {
    const { classes } = this.props;
    return (
      <Tile className={classes.tile} onClick={this.handleClick.bind(this)}>
        Ripple warm Fade
      </Tile>
    );
  }
}

RippleWarmFadeTile.propTypes = {
  // this function is called with the generated pattern as argument
  onClick: PropTypes.func
}

export default withStyles(styles)(withCookies(RippleWarmFadeTile));