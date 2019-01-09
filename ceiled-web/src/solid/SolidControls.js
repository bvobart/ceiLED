import React, { Component } from 'react';
import { withCookies } from 'react-cookie';
import ThreeChannelPicker from '../colorpicking/ThreeChannelPicker';
import { ControllerSocketContext } from '../context/ControllerSocketProvider';
import { CeiledRequestBuilder } from '../context/CeiledRequestBuilder';

class SolidControls extends Component {
  constructor(props) {
    super(props);
    this.state = {
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

  handleChangeColors(colorObj, { getStatus, send, socket }) {
    const colors = [colorObj.channel1, colorObj.channel2, colorObj.channel3];
    if (getStatus() === WebSocket.OPEN) {
      const request = new CeiledRequestBuilder()
        .setType('solid')
        .setColors(colors)
        .setAuthToken(this.props.cookies.get('authToken'))
        .build();
      send(request);
    }
    this.setState(colors);
  }

  render() {
    return (
      <ControllerSocketContext.Consumer>
        {({ getStatus, send, socket }) => 
          <ThreeChannelPicker 
            channel1={this.state.channel1} 
            channel2={this.state.channel2} 
            channel3={this.state.channel3}
            onChange={(colors) => this.handleChangeColors(colors, { 
              getStatus, 
              send,
              socket
            })}
          />
        }
      </ControllerSocketContext.Consumer>
    );
  }
}

export default withCookies(SolidControls);