import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';

import Tile from '../../../common/tiles/Tile';
import { blue, purple, bluePurple, blueGreen, blueGreener } from '../../../colorpicking/colors';
import CeiledRequestBuilder from '../../../context/CeiledRequestBuilder';
import CeiledPatternOptionsBuilder from '../../../context/CeiledPatternOptionsBuilder';
import { toRgbString } from '../../../common/utils';

const styles = theme => ({
  tile: {
    animation: '$simple-cold-fade 15s linear infinite',
    width: '100%',
  },
  '@keyframes simple-cold-fade': {
    '0%': { background: toRgbString(blue) },
    '25%': { background: toRgbString(purple) },
    '50%': { background: toRgbString(bluePurple) },
    '75%': { background: toRgbString(blueGreener) },
    '100%': { background: toRgbString(blue) },
  }
});

class SimpleColdFadeTile extends Component {
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
      .setColors([ blue, purple, bluePurple, blueGreen ])
      .setPatternOptions(patternOptions)
      .setAuthToken(localStorage.getItem('authToken'))
      .build();

    onClick(message);
  }
  
  render() {
    const { classes } = this.props;
    return (
      <Tile className={classes.tile} onClick={this.handleClick.bind(this)}>
        Simple cold Fade
      </Tile>
    );
  }
}

SimpleColdFadeTile.propTypes = {
  // this function is called with the generated pattern as argument
  onClick: PropTypes.func
}

export default withStyles(styles)(SimpleColdFadeTile);