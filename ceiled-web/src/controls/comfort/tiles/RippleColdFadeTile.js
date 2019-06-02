import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';

import Tile from '../../../common/tiles/Tile';
import { blue, purple, bluePurple, blueGreener } from '../../../colorpicking/colors';
import CeiledRequestBuilder from '../../../context/CeiledRequestBuilder';
import CeiledPatternOptionsBuilder from '../../../context/CeiledPatternOptionsBuilder';
import { toRgbStringsList } from '../../../common/utils';

const styles = theme => ({
  tile: {
    animation: '$ripple-cold-fade 15s linear infinite',
    background: `linear-gradient(to right, ${toRgbStringsList([ blue, purple, bluePurple, blueGreener, blue, purple, bluePurple, blueGreener ])})`,
    backgroundSize: '400% 400%',
    width: '100%',
  },
  '@keyframes ripple-cold-fade': {
    '0%'  : { backgroundPosition: '0% 50%' },
    '100%': { backgroundPosition: '76% 50%' },
  }
});

class RippleRgbFadeTile extends Component {
  handleClick() {
    const { onClick } = this.props;
    if (!onClick) return;

    const patternOptions = new CeiledPatternOptionsBuilder()
      .for('fade')
      .setSecondaryColors([ blueGreener, blue, purple, bluePurple ])
      .setTernaryColors([ bluePurple, blueGreener, blue, purple ])
      .setChannels(3)
      .setSpeed(10)
      .build();
    const message = new CeiledRequestBuilder()
      .setType('fade')
      .setColors([ blue, purple, bluePurple, blueGreener ])
      .setPatternOptions(patternOptions)
      .setAuthToken(localStorage.getItem('authToken'))
      .build();

    onClick(message);
  }
  
  render() {
    const { classes } = this.props;
    return (
      <Tile className={classes.tile} onClick={this.handleClick.bind(this)}>
        Ripple cold Fade
      </Tile>
    );
  }
}

RippleRgbFadeTile.propTypes = {
  // this function is called with the generated pattern as argument
  onClick: PropTypes.func
}

export default withStyles(styles)(RippleRgbFadeTile);