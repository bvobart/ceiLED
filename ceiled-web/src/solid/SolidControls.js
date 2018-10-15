import React, { Component } from 'react';
import ThreeChannelPicker from '../colorpicking/ThreeChannelPicker';
import { ControllerSocketContext } from '../context/ControllerSocketProvider';
import { ControllerRequestBuilder } from '../context/ControllerRequestBuilder';

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

  handleChangeColors(colorObj, { brightness, getStatus, roomLight, send, socket }) {
    const colors = [colorObj.channel1, colorObj.channel2, colorObj.channel3];
    if (getStatus() === WebSocket.OPEN) {
      socket.addEventListener('message', (event) => console.log(event));
      const request = new ControllerRequestBuilder()
        .setType('solid')
        .setBrightness(brightness)
        .setRoomlight(roomLight)
        .setColors(colors)
        .build();
      send(request);
    }
    this.setState(colors);
  }

  render() {
    return (
      <ControllerSocketContext.Consumer>
        {({ brightness, getStatus, roomLight, send, socket }) => 
          <ThreeChannelPicker 
            channel1={this.state.channel1} 
            channel2={this.state.channel2} 
            channel3={this.state.channel3}
            onChange={(colors) => this.handleChangeColors(colors, { 
              brightness, 
              getStatus, 
              roomLight, 
              send,
              socket
            })}
          />
        }
      </ControllerSocketContext.Consumer>
    );
  }
}

export default SolidControls;