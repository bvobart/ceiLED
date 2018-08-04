import React, { Component } from 'react';
import { AppBar, Tab, Tabs, withStyles, Button } from '@material-ui/core';
import ColorPicker from '../colorpicking/ColorPicker';
import { toRgbString } from '../common/utils';

const styles = theme => ({
  root: {},
  appBar: {
    backgroundColor: theme.palette.background.paper,
  },
  tabsBar: {
    backgroundColor: theme.palette.background.paper,
  },
  tab: {
    maxWidth: '100%'
  },
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
      tab: 0,
      channel1: props.channel1 ? props.channel1 : black,
      channel2: props.channel2 ? props.channel2 : black,
      channel3: props.channel3 ? props.channel3 : black
    };

    this.handleChangeChannelColor = this.handleChangeChannelColor.bind(this);
    this.handleSetForAllChannels = this.handleSetForAllChannels.bind(this);
  }

  handleSetForAllChannels(event) {
    const color = this.state['channel' + (this.state.tab + 1)];
    this.setState({
      channel1: color,
      channel2: color,
      channel3: color
    });

    if (this.props.onSetForAllChannels) this.props.onSetForAllChannels(color);
  }

  handleChangeChannelColor(event, color) {
    if (this.props.onChange) this.props.onChange({ 
      channel1: this.state.channel1,
      channel2: this.state.channel2,
      channel3: this.state.channel3
    });
    const channel = 'channel' + (this.state.tab + 1);
    this.setState({ [channel]: color });
  }

  render() {
    const { classes } = this.props;
    const { tab } = this.state;
    
    const ch1ColorString = toRgbString(this.state.channel1);
    const ch2ColorString = toRgbString(this.state.channel2);
    const ch3ColorString = toRgbString(this.state.channel3);
    return (
      <div className={classes.root}>
        <AppBar position='static'>
          <Tabs 
              className={classes.tabsBar} 
              centered 
              fullWidth 
              value={tab}
              onChange={(e, tab) => this.setState({ tab })}>
            <Tab className={classes.tab} label='Channel 1' style={{ backgroundColor: ch1ColorString }} />
            <Tab className={classes.tab} label='Channel 2' style={{ backgroundColor: ch2ColorString }} />
            <Tab className={classes.tab} label='Channel 3' style={{ backgroundColor: ch3ColorString }} />
          </Tabs>
        </AppBar>
        {tab === 0 && <ColorPicker color={this.state.channel1} onChange={this.handleChangeChannelColor} /> }
        {tab === 1 && <ColorPicker color={this.state.channel2} onChange={this.handleChangeChannelColor} /> }
        {tab === 2 && <ColorPicker color={this.state.channel3} onChange={this.handleChangeChannelColor} /> }
        <Button className={classes.allChannelsButton} onClick={this.handleSetForAllChannels}>
          Set for all channels
        </Button>
      </div>
    );
  }
}

export default withStyles(styles)(ThreeChannelPicker);
