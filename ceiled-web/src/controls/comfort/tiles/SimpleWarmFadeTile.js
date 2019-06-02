import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';

import Tile from '../../../common/tiles/Tile';
import { toRgbString } from '../../../common/utils';
import { chocolate, red, orangeYellow } from '../../../colorpicking/colors';
import CeiledRequestBuilder from '../../../context/CeiledRequestBuilder';
import CeiledPatternOptionsBuilder from '../../../context/CeiledPatternOptionsBuilder';

const styles = theme => ({
  tile: {
    animation: '$simple-warm-fade 12s linear infinite',
    width: '100%',
  },
  '@keyframes simple-warm-fade': {
    '0%': { background: toRgbString(red) },
    '33%': { background: toRgbString(chocolate) },
    '67%': { background: toRgbString(orangeYellow) },
    '100%': { background: toRgbString(red) },
  }
});

class SimpleWarmFadeTile extends Component {
  handleClick() {
    const { onClick } = this.props;
    if (!onClick) return;

    const patternOptions = new CeiledPatternOptionsBuilder()
      .for('fade')
      .setChannels(1)
      .setSpeed(10)
      .build();
    const message = new CeiledRequestBuilder()
      .setType('fade')
      .setColors([ red, chocolate, orangeYellow ])
      .setPatternOptions(patternOptions)
      .setAuthToken(localStorage.getItem('authToken'))
      .build();

    onClick(message);
  }
  
  render() {
    const { classes } = this.props;
    return (
      <Tile className={classes.tile} onClick={this.handleClick.bind(this)}>
        Simple warm Fade
      </Tile>
    );
  }
}

SimpleWarmFadeTile.propTypes = {
  // this function is called with the generated pattern as argument
  onClick: PropTypes.func
}

export default withStyles(styles)(SimpleWarmFadeTile);