import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ColorPickerDialog from '../../colorpicking/ColorPickerDialog';
import ColorTile from './ColorTile';

class EditableColorTile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    }
  }

  render() {
    return (
      <div style={{ display: 'flex' }}>
        <ColorTile {...this.props} onClick={() => this.setState({ open: true })} />
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

EditableColorTile.propTypes = {
  color: PropTypes.shape({ 
    red: PropTypes.number.isRequired,
    green: PropTypes.number.isRequired,
    blue: PropTypes.number.isRequired,
  }).isRequired,
  onChange: PropTypes.func,
  onDelete: PropTypes.func
}

export default EditableColorTile;
