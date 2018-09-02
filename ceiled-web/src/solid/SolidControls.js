import React, { Component } from 'react';
import ThreeChannelPicker from '../colorpicking/ThreeChannelPicker';

class SolidControls extends Component {
  constructor(props) {
    super(props);
    this.state = {
      channel1: {
        red: Math.round(Math.random() * 255),
        green: Math.round(Math.random() * 255),
        blue: Math.round(Math.random() * 255),
      },
      channel2: {
        red: Math.round(Math.random() * 255),
        green: Math.round(Math.random() * 255),
        blue: Math.round(Math.random() * 255),
      },
      channel3: {
        red: Math.round(Math.random() * 255),
        green: Math.round(Math.random() * 255),
        blue: Math.round(Math.random() * 255),
      }
    };
  }

  handleChangeColors(colors) {
    // TODO: send to actual controller as well.
    this.setState(colors);
  }

  render() {
    return (
      <ThreeChannelPicker 
        channel1={this.state.channel1} 
        channel2={this.state.channel2} 
        channel3={this.state.channel3}
        onChange={this.handleChangeColors.bind(this)}
      />
    );
  }
}

export default SolidControls;