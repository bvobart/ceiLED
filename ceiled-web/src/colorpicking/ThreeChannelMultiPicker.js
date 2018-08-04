import React, { Component } from 'react';
import ThreeChannelPickerBase from './ThreeChannelPickerBase';

class ThreeChannelMultiPicker extends Component {
  constructor(props) {
    super(props);
    const black = { red: 0, green: 0, blue: 0 };
    this.state = {
      channel1: props.channel1 ? props.channel1 : [black],
      channel2: props.channel2 ? props.channel2 : [black],
      channel3: props.channel3 ? props.channel3 : [black]
    };
  }

  render() {
    return (
      <ThreeChannelPickerBase
        channel1={this.state.channel1[0]}
        channel2={this.state.channel2[0]}
        channel3={this.state.channel3[0]}
      >
        
      </ThreeChannelPickerBase>
    );
  }
}

export default ThreeChannelMultiPicker;
