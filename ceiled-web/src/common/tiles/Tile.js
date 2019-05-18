import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@material-ui/core';

class Tile extends Component {
  render() {
    const { className, children, onClick } = this.props;
    const style = {
      minHeight: 50,
      minWidth: 32,
      borderRadius: 0,
      ...this.props.style
    };

    return (
      <Button
        className={className}
        onClick={() => onClick && onClick()}
        variant='text'
        style={style}
      >
        {children}
      </Button>
    );
  }
}

Tile.propTypes = {
  // anything to render inside the tile
  children: PropTypes.node,
  // CSS class name
  className: PropTypes.string,
  // since the tile is actually a button, this function is executed when the tile is clicked
  onClick: PropTypes.func,
  // CSS style object
  style: PropTypes.object
};

export default Tile;