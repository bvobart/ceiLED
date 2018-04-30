import React, { Component } from 'react';
import withWindowSize from './withWindowSize';
import { CardTitle } from 'material-ui/Card';

import LEDControls from './LEDControls';
import Paper from 'material-ui/Paper/Paper';

class App extends Component {
    render() {
        const mainStyle = {
            width: this.props.isMobile ? this.props.windowSize.innerWidth : this.props.mobileMaxWidth
        }
        return (
            <Paper style={mainStyle}>
                <CardTitle title='CeiLED' subtitle='Controlling those LEDs on a ceiling near you ;)' />
                <LEDControls />
            </Paper>
        );
    }
}

export default withWindowSize(App);
