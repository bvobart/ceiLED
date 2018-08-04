import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { AppBar, Tab, Tabs, withStyles, Button } from '@material-ui/core';
import ColorPicker from '../colorpicking/ColorPicker';

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

class ThreeChannelPickerBase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tab: 0
    };
  }

  render() {
    const { classes, tabBgColors } = this.props;
    const { tab } = this.state;
    const currentColor = this.props['channel' + (tab + 1)];

    return (
      <div className={classes.root}>
        <AppBar position='static'>
          <Tabs 
              className={classes.tabsBar} 
              centered 
              fullWidth 
              value={tab}
              onChange={(e, tab) => this.setState({ tab })}>
            <Tab className={classes.tab} label='Channel 1' style={{ backgroundColor: tabBgColors.channel1 }} />
            <Tab className={classes.tab} label='Channel 2' style={{ backgroundColor: tabBgColors.channel2 }} />
            <Tab className={classes.tab} label='Channel 3' style={{ backgroundColor: tabBgColors.channel3 }} />
          </Tabs>
        </AppBar>
        {tab === 0 && <ColorPicker color={this.props.channel1} onChange={(e, color) => this.props.onPickChannelColor(tab, color)} /> }
        {tab === 1 && <ColorPicker color={this.props.channel2} onChange={(e, color) => this.props.onPickChannelColor(tab, color)} /> }
        {tab === 2 && <ColorPicker color={this.props.channel3} onChange={(e, color) => this.props.onPickChannelColor(tab, color)} /> }
        {this.props.children}
        <Button className={classes.allChannelsButton} onClick={() => this.props.onSetForAllChannels(currentColor)}>
          Set for all channels
        </Button>
      </div>
    );
  }
}

const colorPropType = PropTypes.shape({ 
  red: PropTypes.number,
  green: PropTypes.number,
  blue: PropTypes.number
})

ThreeChannelPickerBase.propTypes = {
  channel1: colorPropType.isRequired,
  channel2: colorPropType.isRequired,
  channel3: colorPropType.isRequired,
  tabBgColors: PropTypes.shape({
    channel1: PropTypes.string,
    channel2: PropTypes.string,
    channel3: PropTypes.string
  }).isRequired,
  onPickChannelColor: PropTypes.func.isRequired,
  onSetForAllChannels: PropTypes.func.isRequired
}

ThreeChannelPickerBase.defaultProps = {
  tabBgColors: {},
  onPickChannelColor: () => {},
  onSetForAllChannels: () => {}
}

export default withStyles(styles)(ThreeChannelPickerBase);
