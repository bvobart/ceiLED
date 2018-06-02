import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import withWindowSize from './withWindowSize';
import { CardTitle } from 'material-ui/Card';

import LEDControls from './LEDControls';
import Paper from 'material-ui/Paper/Paper';
import IconButton from 'material-ui/IconButton';
import PowerIcon from 'material-ui/svg-icons/action/power-settings-new';
import { greenA700, redA700 } from 'material-ui/styles/colors';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      enabled: true
    };
  }
  
  render() {
    const mainStyle = {
      width: this.props.isMobile ? this.props.windowSize.innerWidth : this.props.mobileMaxWidth
    }
    
    return (
      <Paper style={mainStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <CardTitle title='CeiLED' subtitle='Controlling those LEDs on a ceiling near you ;)' />
          <IconButton 
            onClick={event => this.setState({ enabled: !this.state.enabled })}
            iconStyle={{ height: 68, width: 68 }}
            style={{ height: 84, width: 84, paddingRight: 16 }}
          >
            <PowerIcon 
              color={this.state.enabled ? greenA700 : redA700 }
            />
          </IconButton>
        </div>
        <LEDControls enabled={this.state.enabled} />
      </Paper>
    );
  }
}

export default hot(module)(withWindowSize(App));
