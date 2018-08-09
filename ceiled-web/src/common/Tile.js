import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@material-ui/core';
import { toRgbString } from './utils';

class Tile extends Component {
  render() {
    const colorString = toRgbString(this.props.color);
    const tileStyle = {
      height: 50,
      minWidth: 0,
      backgroundColor: colorString,
      borderRadius: 0,
      flex: this.props.flex ? this.props.flex : '1 100%'
    };

    return (
      <Button
        className={this.props.className}
        style={tileStyle} 
        onClick={() => this.props.onClick && this.props.onClick(this.props.color)}
        variant='flat'
      >
        <div>{this.props.label}</div>
      </Button>
    );
  }
}

Tile.propTypes = {
  // color of the tile.
  color: PropTypes.shape({
    red: PropTypes.number.isRequired,
    green: PropTypes.number.isRequired,
    blue: PropTypes.number.isRequired
  }).isRequired,
  // sets the CSS flex property on the component.
  flex: PropTypes.string,
  // text to display on the tile
  label: PropTypes.string,
  // since the tile is actually a button, this function is executed when the tile is clicked
  onClick: PropTypes.func
};

Tile.defaultProps = {
  color: { red: 0, green: 0, blue: 0 }
};

export default Tile;