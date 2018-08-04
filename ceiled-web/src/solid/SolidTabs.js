import React, { Component } from 'react';
import { AppBar, Tab, Tabs, withStyles, Button } from '@material-ui/core';
import SolidControls from './SolidControls';

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

class SolidTabs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      solidControlsTab: 0,
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

    this.handleChangeChannelColor = this.handleChangeChannelColor.bind(this);
    this.handleConfirmChannelColor = this.handleConfirmChannelColor.bind(this);
    this.handleSetForAllChannels = this.handleSetForAllChannels.bind(this);
  }

  handleSetForAllChannels(event) {
    const color = this.state['channel' + (this.state.solidControlsTab + 1)];
    this.setState({
      channel1: color,
      channel2: color,
      channel3: color
    });
    // TODO: call controller to actually set to this value.
  }

  handleChangeChannelColor(event, color) {
    const channel = 'channel' + (this.state.solidControlsTab + 1);
    this.setState({ [channel]: color });
    // const socket = new WebSocket('ws://localhost:6565');
    // socket.onopen = event => {
    //   const request = {
    //     data: {
    //       type: 'solid',
    //       colors: [color],
    //       brightness: 100,
    //       roomLight: 0
    //     }
    //   };
    //   socket.send(JSON.stringify(request));
    //   socket.close();
    // };
  }

  handleConfirmChannelColor(event, color) {
    // TODO: send color to controller when color for a channel is confirmed.
  }

  render() {
    const { classes } = this.props;
    const { solidControlsTab } = this.state;
    return (
      <div className={classes.root}>
        <AppBar position='static'>
          <Tabs 
              className={classes.tabsBar} 
              centered 
              fullWidth 
              value={solidControlsTab}
              onChange={(e, tab) => this.setState({ solidControlsTab: tab })}>
            <Tab className={classes.tab} label='Channel 1' />
            <Tab className={classes.tab} label='Channel 2' />
            <Tab className={classes.tab} label='Channel 3' />
          </Tabs>
        </AppBar>
        {solidControlsTab === 0 && <SolidControls color={this.state.channel1} onChange={this.handleChangeChannelColor} /> }
        {solidControlsTab === 1 && <SolidControls color={this.state.channel2} onChange={this.handleChangeChannelColor} /> }
        {solidControlsTab === 2 && <SolidControls color={this.state.channel3} onChange={this.handleChangeChannelColor} /> }
        <Button className={classes.allChannelsButton} onClick={this.handleSetForAllChannels}>
          Set for all channels
        </Button>
      </div>
    );
  }
}

export default withStyles(styles)(SolidTabs);
