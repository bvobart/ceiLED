import React, { Component } from 'react';
import ThreeChannelPickerBase from './ThreeChannelPickerBase';
import MultiSelectedBox from './MultiSelectedBox';
import { withStyles } from '@material-ui/core';
import { toRgbStringsList } from '../common/utils';

const styles = theme => ({
  root: {
    display: 'flex'
  },
  selectedBox: {
    flex: '1 33%'
  },
  tab1: {
    background: 'linear-gradient(to right, var(--ch1Colors))'
  },
  tab2: {
    background: 'linear-gradient(to right, var(--ch2Colors))'
  },
  tab3: {
    background: 'linear-gradient(to right, var(--ch3Colors))'
  },
});

class ThreeChannelMultiPicker extends Component {
  constructor(props) {
    super(props);
    const black = { red: 0, green: 0, blue: 0 };
    this.state = {
      channel1: props.channel1 ? props.channel1 : [black],
      channel2: props.channel2 ? props.channel2 : [black],
      channel3: props.channel3 ? props.channel3 : [black]
    };

    this.handleConfirmChannelColor = this.handleConfirmChannelColor.bind(this);
  }

  handleConfirmChannelColor(channelNr, color) {
    const chName = 'channel' + channelNr;
    const colors = this.state[chName];
    colors.push(color);
    this.setState({ [chName]: colors });
    if (this.props.onChange) this.props.onChange(channelNr, colors);
  }

  render() {
    const { classes } = this.props;
    const { channel1, channel2, channel3 } = this.state;
    return (
      <ThreeChannelPickerBase
        classes={{ tab1: classes.tab1, tab2: classes.tab2, tab3: classes.tab3 }}
        className={classes.root}
        channel1={channel1[0]}
        channel2={channel2[0]}
        channel3={channel3[0]}
        onChangeChannelColor={() => {}}
        onConfirmChannelColor={this.handleConfirmChannelColor}
        style={{
          '--ch1Colors': toRgbStringsList(channel1),
          '--ch2Colors': toRgbStringsList(channel2),
          '--ch3Colors': toRgbStringsList(channel3)
        }}
      >
        <MultiSelectedBox 
          className={classes.selectedBox} 
          colors={channel1} 
          label='Channel 1'
          onChange={(colors) => this.setState({ channel1: colors })} 
        />
        <MultiSelectedBox 
          className={classes.selectedBox} 
          colors={channel2}
          label='Channel 2' 
          onChange={(colors) => this.setState({ channel2: colors })} 
        />
        <MultiSelectedBox 
          className={classes.selectedBox} 
          colors={channel3}
          label='Channel 3' 
          onChange={(colors) => this.setState({ channel3: colors })} 
        />
      </ThreeChannelPickerBase>
    );
  }
}

export default withStyles(styles)(ThreeChannelMultiPicker);
