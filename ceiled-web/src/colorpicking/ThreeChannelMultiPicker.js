import React, { Component } from 'react';
import ThreeChannelPickerBase from './ThreeChannelPickerBase';
import MultiSelectedBox from './MultiSelectedBox';
import { withStyles } from '@material-ui/core';

const styles = theme => ({
  root: {
    display: 'flex'
  },
  selectedBox: {
    flex: '1 33%'
  }
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
  }

  render() {
    const { classes } = this.props;
    const { channel1, channel2, channel3 } = this.state;
    return (
      <ThreeChannelPickerBase
        className={classes.root}
        channel1={channel1[0]}
        channel2={channel2[0]}
        channel3={channel3[0]}
      >
        <MultiSelectedBox className={classes.selectedBox} colors={channel1} onChange={(colors) => this.setState({ channel1: colors })} />
        <MultiSelectedBox className={classes.selectedBox} colors={channel2} onChange={(colors) => this.setState({ channel2: colors })} />
        <MultiSelectedBox className={classes.selectedBox} colors={channel3} onChange={(colors) => this.setState({ channel3: colors })} />
      </ThreeChannelPickerBase>
    );
  }
}

export default withStyles(styles)(ThreeChannelMultiPicker);
