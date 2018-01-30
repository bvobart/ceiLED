import React, { Component } from 'react';
import { CardText } from 'material-ui/Card';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import Slider from 'material-ui/Slider';

class LEDControls extends Component {
    constructor(props) {
        super(props);
        this.state = {
            red: 0,
            green: 0,
            blue: 0
        }
        
        this.handleRedChange = this.handleRedChange.bind(this);
        this.handleGreenChange = this.handleGreenChange.bind(this);
        this.handleBlueChange = this.handleBlueChange.bind(this);
    }

    handleRedChange(event, newValue) {
        this.setState({ red: newValue });
    }

    handleGreenChange(event, newValue) {
        this.setState({ green: newValue });
    }

    handleBlueChange(event, newValue) {
        this.setState({ blue: newValue });
    }
    
    handleSetColor(event) {
        // No connection can be made right now
        // const socket = new WebSocket('ws://localhost:6565');
        // socket.send('je moeder');
        // socket.close();
    }

    render() {
        const colorString = 'rgb(' + this.state.red + ',' + this.state.green + ',' + this.state.blue + ')'
        return (
            <CardText>
                Red: {this.state.red} <br />
                <Slider max={255} step={1} value={this.state.red} onChange={this.handleRedChange} />
                Green: {this.state.green} <br />
                <Slider max={255} step={1} value={this.state.green} onChange={this.handleGreenChange} />
                Blue: {this.state.blue} <br />
                <Slider max={255} step={1} value={this.state.blue} onChange={this.handleBlueChange} />
                Should result in the following colour: 
                <Paper style={{ width: '100%', height: 50, backgroundColor: colorString }} />
                <br />
                <RaisedButton primary label='Set' onClick={this.handleSetColor}/>
            </CardText>
        )
    }
}

export default LEDControls;