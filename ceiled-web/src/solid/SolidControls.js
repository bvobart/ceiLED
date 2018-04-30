import React, { Component } from 'react';
import SolidOptionsPanel from './SolidOptionsPanel';
import Tile from '../common/Tile';

class SolidControls extends Component {

  handleClick(event, color) {
    console.log('Sending colour: ', color);
    const socket = new WebSocket('ws://localhost:6565');
    socket.onopen = event => {
      const request = {
        data: {
          type: 'solid',
          colors: [color],
          brightness: 100,
          roomLight: 0
        }
      };
      socket.send(JSON.stringify(request));
      socket.close();
    };
  }
  
  render() {
    const black = { red: 0, green: 0, blue: 0 };
    const white = { red: 255, green: 255, blue: 255 };
    const red = { red: 255, green: 0, blue: 0 };
    const green = { red: 0, green: 255, blue: 0 };
    const blue = { red: 0, green: 0, blue: 255 };

    return (
      <div style={{ display: 'flex', flexFlow: 'row wrap' }}>
        <div style={{ flex: '1 60%' }}>
          <div style={{ display: 'flex' }}>
            <Tile color={black} onClick={this.handleClick} />
            <Tile color={white} onClick={this.handleClick} />
            <Tile color={red} onClick={this.handleClick} />
            <Tile color={green} onClick={this.handleClick} />
            <Tile color={blue} onClick={this.handleClick} />
          </div>
          <div style={{ display: 'flex' }}>
            <Tile color={white} onClick={this.handleClick} />
            <Tile color={black} onClick={this.handleClick} />
            <Tile color={red} onClick={this.handleClick} />
            <Tile color={green} onClick={this.handleClick} />
            <Tile color={blue} onClick={this.handleClick} />
          </div>
        </div>
        <SolidOptionsPanel style={{ flex: '1 40%', padding: 10 }} />
      </div>
    );
  }
}

export default SolidControls;
