import React, { Component } from 'react';
import { Button } from '@material-ui/core';

class Tile extends Component {

  render() {
    const colorString = 'rgb(' + this.props.color.red + ',' + this.props.color.green + ',' + this.props.color.blue + ')';
    const tileStyle = {
      height: 50,
      minWidth: 0,
      backgroundColor: colorString,
      borderRadius: 0,
      flex: this.props.flex ? this.props.flex : '1 100%'
    };

    return (
      <Button
        style={tileStyle} 
        onClick={(event) => this.props.onClick && this.props.onClick(event, this.props.color)}
        variant='flat'
      >
        <div></div>
      </Button>
    );
  }
}

export default Tile;