import React, { Component } from 'react';
import { Button, withStyles } from '@material-ui/core';
import { toRgbString } from '../common/utils';
import ThreeChannelPickerBase from './ThreeChannelPickerBase';

const styles = theme => ({
  allChannelsButton: {
    backgroundColor: theme.palette.background.paper,
    borderRadius: 0,
    width: '100%',
    '&:hover': {
      backgroundColor: theme.palette.background.default
    }
  }
});

class ThreeChannelPicker extends Component {
  constructor(props) {
    super(props);
    const black = { red: 0, green: 0, blue: 0 };
    this.state = {
      channel1: props.channel1 ? props.channel1 : black,
      channel2: props.channel2 ? props.channel2 : black,
      channel3: props.channel3 ? props.channel3 : black,
    };
    this.state.lastChanged = this.state.channel1

    this.handleChangeChannelColor = this.handleChangeChannelColor.bind(this);
    this.handleSetForAllChannels = this.handleSetForAllChannels.bind(this);
  }

  handleSetForAllChannels() {
    const color = this.state.lastChanged;
    const newColors = {
      channel1: color,
      channel2: color,
      channel3: color,
    };
    this.setState({ ...newColors, lastChanged: color });

    if (this.props.onChange) this.props.onChange(newColors);
  }

  handleChangeChannelColor(channelNr, color) {
    const channel = 'channel' + channelNr;
    const newColors = {
      channel1: this.state.channel1,
      channel2: this.state.channel2,
      channel3: this.state.channel3,
      [channel]: color,
    };
    this.setState({ ...newColors, lastChanged: color });
    
    if (this.props.onChange) this.props.onChange(newColors);
  }

  render() {
    const { classes } = this.props;  
    const tabBgColors = {
      channel1: toRgbString(this.state.channel1),
      channel2: toRgbString(this.state.channel2),
      channel3: toRgbString(this.state.channel3),
    }
    return (
      <ThreeChannelPickerBase
        {...this.state}
        tabBgColors={tabBgColors}
        onChangeChannelColor={this.handleChangeChannelColor}
        onConfirmChannelColor={this.handleChangeChannelColor}
      >
        <Button className={classes.allChannelsButton} onClick={this.handleSetForAllChannels}>
          Set for all channels
        </Button> 
      </ThreeChannelPickerBase>
    );
  }
}

export default withStyles(styles)(ThreeChannelPicker);
