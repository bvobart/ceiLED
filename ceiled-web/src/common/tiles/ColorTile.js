import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { toRgbString } from '../utils';
import Tile from './Tile';

class ColorTile extends Component {
  render() {
    const { className, color, flex, onClick } = this.props;
    const colorString = toRgbString(color);
    const tileStyle = {
      backgroundColor: colorString,
      flex: flex ? flex : '1 100%'
    };

    return (
      <Tile
        className={className}
        style={tileStyle} 
        onClick={() => onClick && onClick(this.props.color)}
      >
        <div>{this.props.label}</div>
      </Tile>
    );
  }
}

ColorTile.propTypes = {
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

ColorTile.defaultProps = {
  color: { red: 0, green: 0, blue: 0 }
};

export default ColorTile;