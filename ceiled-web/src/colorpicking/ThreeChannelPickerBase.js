import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash.isequal';
import { AppBar, Tab, Tabs, withStyles } from '@material-ui/core';
import ColorPicker from '../colorpicking/ColorPicker';

const styles = theme => ({
  appBar: {
    backgroundColor: theme.palette.background.paper,
  },
  tabsBar: {
    backgroundColor: theme.palette.background.paper,
  },
  tab1: {
    maxWidth: '100%'
  },
  tab2: {
    maxWidth: '100%'
  },
  tab3: {
    maxWidth: '100%'
  }
});

class ThreeChannelPickerBase extends Component {
  constructor(props) {
    super(props);
    const black = { red: 0, green: 0, blue: 0 }
    this.state = {
      tab: 0,
      color1: props.channel1 ? props.channel1 : black,
      color2: props.channel2 ? props.channel2 : black,
      color3: props.channel3 ? props.channel3 : black,
      prevPropColor1: props.channel1 ? props.channel1 : black,
      prevPropcolor2: props.channel2 ? props.channel2 : black,
      prevPropcolor3: props.channel3 ? props.channel3 : black,
    };

    this.handleChangeTab = this.handleChangeTab.bind(this);
    this.handleChangeChannelColor = this.handleChangeChannelColor.bind(this);
    this.handleConfirmChannelColor = this.handleConfirmChannelColor.bind(this);
  }

  static getDerivedStateFromProps(props, state) {
    const oldPropColors = {
      color1: state.prevPropColor1,
      color2: state.prevPropColor2,
      color3: state.prevPropColor3,
    }

    const newPropColors = {
      color1: props.channel1,
      color2: props.channel2,
      color3: props.channel3,
    };

    if (!isEqual(oldPropColors, newPropColors)) {
      return {
        ...newPropColors,
        prevPropColor1: props.channel1,
        prevPropColor2: props.channel2,
        prevPropColor3: props.channel3
      };
    }
    return null;
  }

  handleChangeChannelColor(channel, color) {
    const { onChangeChannelColor } = this.props;
    onChangeChannelColor && onChangeChannelColor(channel, color);
    this.setState({ ['color' + channel]: color });
  }

  handleConfirmChannelColor(channel, color) {
    const { onConfirmChannelColor } = this.props;
    onConfirmChannelColor && onConfirmChannelColor(channel, color);
    this.setState({ ['color' + channel]: color });
  }

  handleChangeTab(tab) {
    this.setState({ tab });
    this.handleChangeChannelColor(tab + 1, this.state['color' + (tab + 1)]);
  }

  renderColorPicker(tab) {
    const channel = tab + 1;
    return (
      <ColorPicker
        color={this.state['color' + channel]} 
        onChange={(color) => this.handleChangeChannelColor(channel, color)}
        onConfirm={(color) => this.handleConfirmChannelColor(channel, color)}
      />
    );
  }

  render() {
    const { classes, tabBgColors } = this.props;
    const { tab } = this.state;

    return (
      <div style={this.props.style}>
        <AppBar position='static'>
          <Tabs 
              className={classes.tabsBar} 
              centered 
              fullWidth 
              value={tab}
              onChange={(e, tab) => this.handleChangeTab(tab)}>
            <Tab className={classes.tab1} label='Channel 1' style={{ backgroundColor: tabBgColors.channel1 }} />
            <Tab className={classes.tab2} label='Channel 2' style={{ backgroundColor: tabBgColors.channel2 }} />
            <Tab className={classes.tab3} label='Channel 3' style={{ backgroundColor: tabBgColors.channel3 }} />
          </Tabs>
        </AppBar>
        {tab === 0 && this.renderColorPicker(tab) }
        {tab === 1 && this.renderColorPicker(tab) }
        {tab === 2 && this.renderColorPicker(tab) }
        
        <div className={this.props.className}>
          {this.props.children}
        </div>
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
  onChangeChannelColor: PropTypes.func.isRequired,
  onConfirmChannelColor: PropTypes.func.isRequired,
}

ThreeChannelPickerBase.defaultProps = {
  tabBgColors: {},
  // onChangeChannelColor: () => {},
  // onConfirmChannelColor: () => {},
  // onSetForAllChannels: () => {}
}

export default withStyles(styles)(ThreeChannelPickerBase);
