import React, { Component } from 'react';
import JumpOptionsControl from './JumpOptionsControl';
import { withStyles } from '@material-ui/core';
import ThreeChannelMultiPicker from '../colorpicking/ThreeChannelMultiPicker';

const styles = theme => ({
  
})

class JumpControls extends Component {
  constructor(props) {
    super(props);
    this.state = {
      options: {
        jumpMode: 3,
        speed: 60
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
  }

  handleChangeColors(channelNr, colors) {
    // TODO: send colors to controller here
    this.setState({ ['channel' + channelNr]: colors });
  }

  /**
   * Handles changes in the JumpControlOptions.
   * In case the jump mode changes, also sets the colours of the other channels. It does this by
   * making use of the fact that JavaScript copies arrays by reference. So when switching to double
   * channel mode, channel1 and channel3 will reference to the same underlying array, causing any
   * operations on them to affect both channels. Meanwhile, channel2 will have its own array of
   * colours, as Array.slice() returns a (shallow) copy of the array, effectively 'unbinding' it
   * from the other channels.
   * @param {*} options the new JumpControlOptions
   */
  handleChangeOptions(options) {
    if (options.jumpMode !== this.state.options.jumpMode) {
      const { channel1, channel2, channel3 } = this.state;
      if (options.jumpMode === 1) { 
        // set to single channel --> channel1 === channel2 === channel3
        this.setState({ channel2: channel1, channel3: channel1 });
      } else if (options.jumpMode === 2) { 
        // set to double channel --> channel1 === channel3
        this.setState({ channel2: channel2.slice(), channel3: channel1 });
      } else {
        // set to triple channel --> each channel has its own array
        this.setState({ channel1: channel1.slice(), channel2: channel2.slice(), channel3: channel3.slice() })
      }
    }
    this.setState({ options });
  }

  render() {
    return (
      <div>
        <JumpOptionsControl 
          options={this.state.options} 
          onChange={this.handleChangeOptions} 
        />
        <ThreeChannelMultiPicker
          key={this.state.options.jumpMode}
          channel1={this.state.channel1}
          channel2={this.state.channel2}
          channel3={this.state.channel3}
          onChange={this.handleChangeColors} 
        />
      </div>
    );
  }
}

export default withStyles(styles)(JumpControls);
