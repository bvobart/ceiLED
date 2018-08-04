import React, { Component } from 'react';
import { toRgbString } from '../common/utils';
import ThreeChannelPickerBase from './ThreeChannelPickerBase';

class ThreeChannelPicker extends Component {
  constructor(props) {
    super(props);
    const black = { red: 0, green: 0, blue: 0 };
    this.state = {
      channel1: props.channel1 ? props.channel1 : black,
      channel2: props.channel2 ? props.channel2 : black,
      channel3: props.channel3 ? props.channel3 : black
    };

    this.handlePickChannelColor = this.handlePickChannelColor.bind(this);
    this.handleSetForAllChannels = this.handleSetForAllChannels.bind(this);
  }

  handleSetForAllChannels(color) {
    this.setState({
      channel1: color,
      channel2: color,
      channel3: color
    });

    if (this.props.onSetForAllChannels) this.props.onSetForAllChannels(color);
  }

  handlePickChannelColor(channelNr, color) {
    if (this.props.onChange) this.props.onChange(this.state);
    const channel = 'channel' + (channelNr + 1);
    this.setState({ [channel]: color });
  }

  render() {    
    const tabBgColors = {
      channel1: toRgbString(this.state.channel1),
      channel2: toRgbString(this.state.channel2),
      channel3: toRgbString(this.state.channel3),
    }
    return (
      <ThreeChannelPickerBase
        {...this.state}
        tabBgColors={tabBgColors}
        onPickChannelColor={this.handlePickChannelColor}
        onSetForAllChannels={this.handleSetForAllChannels}
      />
    );
  }
}

export default ThreeChannelPicker;
