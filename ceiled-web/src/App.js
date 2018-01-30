import React, { Component } from 'react';
import withWindowSize from './withWindowSize';
import { Card, CardTitle, CardText } from 'material-ui/Card';

import LEDControls from './LEDControls';

class App extends Component {
    render() {
        const mainStyle = {
            width: this.props.isMobile ? this.props.windowSize.innerWidth : this.props.mobileMaxWidth
        }
        return (
            <Card style={mainStyle}>
                <CardTitle title='CeiLED' subtitle='Controlling those LEDs on a ceiling near you ;)' />
                <LEDControls />
            </Card>
        );
    }
}

export default withWindowSize(App);
