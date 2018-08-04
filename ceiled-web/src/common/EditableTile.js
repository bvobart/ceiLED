import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ColorPickerDialog from '../colorpicking/ColorPickerDialog';
import Tile from './Tile';

class EditableTile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    }
  }

  render() {
    return (
      <div>
        <Tile {...this.props} onClick={() => this.setState({ open: true })} />
        <ColorPickerDialog
          color={this.props.color}
          open={this.state.open} 
          onConfirm={this.props.onChange}
          onDelete={this.props.onDelete}
          onClose={() => this.setState({ open: false })}
        />
      </div>
    );
  }
}

EditableTile.propTypes = {
  color: PropTypes.shape({ 
    red: PropTypes.number.isRequired,
    green: PropTypes.number.isRequired,
    blue: PropTypes.number.isRequired,
  }).isRequired,
  onChange: PropTypes.func,
  onDelete: PropTypes.func
}

export default EditableTile;
