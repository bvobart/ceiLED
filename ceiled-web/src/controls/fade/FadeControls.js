import React, { Component } from 'react';
import { withCookies } from 'react-cookie';
import { Button, withStyles } from '@material-ui/core';

import FadeOptionsControl from './FadeOptionsControl';
import ThreeChannelMultiPicker from '../../colorpicking/ThreeChannelMultiPicker';
import { ControllerSocketContext } from '../../context/ControllerSocketProvider';
import { CeiledPatternOptionsBuilder } from '../../context/CeiledPatternOptionsBuilder';
import { CeiledRequestBuilder } from '../../context/CeiledRequestBuilder';

const styles = theme => ({
  confirmButton: {
    width: '100%'
  }
})

class FadeControls extends Component {
  constructor(props) {
    super(props);
    this.state = {
      options: {
        fadeMode: 3,
        speed: 30
      },
      channel1: [{
        red: Math.round(Math.random() * 255),
        green: Math.round(Math.random() * 255),
        blue: Math.round(Math.random() * 255),
      }],
      channel2: [{
        red: Math.round(Math.random() * 255),
        green: Math.round(Math.random() * 255),
        blue: Math.round(Math.random() * 255),
      }],
      channel3: [{
        red: Math.round(Math.random() * 255),
        green: Math.round(Math.random() * 255),
        blue: Math.round(Math.random() * 255),
      }]
    };

    this.handleChangeColors = this.handleChangeColors.bind(this);
    this.handleChangeOptions = this.handleChangeOptions.bind(this);
    this.handleConfirm = this.handleConfirm.bind(this);
  }

  handleChangeColors(channelNr, colors) {
    this.setState({ ['channel' + channelNr]: colors });
  }

  /**
   * Handles changes in the FadeControlOptions.
   * In case the fade mode changes, also sets the colours of the other channels. It does this by
   * making use of the fact that JavaScript copies arrays by reference. So when switching to double
   * channel mode, channel1 and channel3 will reference to the same underlying array, causing any
   * operations on them to affect both channels. Meanwhile, channel2 will have its own array of
   * colours, as Array.slice() returns a (shallow) copy of the array, effectively 'unbinding' it
   * from the other channels.
   * @param {*} options the new FadeControlOptions
   */
  handleChangeOptions(options) {
    if (options.fadeMode !== this.state.options.fadeMode) {
      const { channel1, channel2, channel3 } = this.state;
      if (options.fadeMode === 1) { 
        // set to single channel --> channel1 === channel2 === channel3
        this.setState({ channel2: channel1, channel3: channel1 });
      } else if (options.fadeMode === 2) { 
        // set to double channel --> channel1 === channel3
        this.setState({ channel2: channel2.slice(), channel3: channel1 });
      } else {
        // set to triple channel --> each channel has its own array
        this.setState({ channel1: channel1.slice(), channel2: channel2.slice(), channel3: channel3.slice() })
      }
    }
    this.setState({ options });
  }

  handleConfirm({ getStatus, send }) {
    const { cookies } = this.props;
    const { channel1, channel2, channel3, options } = this.state;
    if (getStatus() === WebSocket.OPEN) {
      const patternOptions = new CeiledPatternOptionsBuilder()
        .for('fade')
        .setSecondaryColors(options.fadeMode >= 2 ? channel2 : undefined)
        .setTernaryColors(options.fadeMode >= 3 ? channel3 : undefined)
        .setChannels(options.fadeMode)
        .setSpeed(options.speed)
        .build();
      const request = new CeiledRequestBuilder()
        .setType('fade')
        .setColors(channel1)
        .setPatternOptions(patternOptions)
        .setAuthToken(cookies.get('authToken'))
        .build();
      send(request);
    }
  }

  render() {
    const { classes } = this.props;
    return (
      <ControllerSocketContext.Consumer>
        {({ getStatus, send }) => (
          <div>
            <FadeOptionsControl 
              options={this.state.options} 
              onChange={this.handleChangeOptions} 
            />
            <ThreeChannelMultiPicker
              key={this.state.options.fadeMode}
              channel1={this.state.channel1}
              channel2={this.state.channel2}
              channel3={this.state.channel3}
              onChange={this.handleChangeColors} 
            />
            <Button 
              className={classes.confirmButton} 
              variant='outlined' 
              onClick={() => this.handleConfirm({ getStatus, send })}
            >
              Confirm
            </Button>
          </div>
        )}
      </ControllerSocketContext.Consumer>
    );
  }
}

export default withStyles(styles)(withCookies(FadeControls));
