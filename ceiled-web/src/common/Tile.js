import React, { Component } from 'react';
import FlatButton from 'material-ui/FlatButton';

class Tile extends Component {

  render() {
    const colorString = 'rgb(' + this.props.color.red + ',' + this.props.color.green + ',' + this.props.color.blue + ')';
    const tileStyle = {
      height: 50,
      minWidth: 0,
      backgroundColor: colorString,
      flex: '1 100%'
    };

    return (
      <FlatButton
        label=' '
        style={tileStyle} 
        onClick={(event) => this.props.onClick(event, this.props.color)}
      >
      </FlatButton>
    );
  }
}

export default Tile;