import React, { Component } from 'react';
import FadeOptionsControl from './FadeOptionsControl';
import { withStyles } from '@material-ui/core';
import ThreeChannelPicker from '../colorpicking/ThreeChannelPicker';

const styles = theme => ({
  
})

class FadeControls extends Component {
  constructor(props) {
    super(props);
    this.state = {
      options: {
        fadeMode: 3
      },
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
  }

  render() {
    return (
      <div>
        <FadeOptionsControl 
          options={this.state.options} 
          onChange={options => this.setState({ options })} 
        />
        <ThreeChannelPicker
          channel1={this.state.channel1}
          channel2={this.state.channel2}
          channel3={this.state.channel3}
          onChange={(colors) => console.log(colors)} 
        />
      </div>
    );
  }
}

export default withStyles(styles)(FadeControls);
