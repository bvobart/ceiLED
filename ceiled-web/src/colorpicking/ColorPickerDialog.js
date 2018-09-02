import React, { Component } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@material-ui/core';
import ColorPicker from './ColorPicker';

class ColorPickerDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      color: props.color
    }

    this.handleConfirm = this.handleConfirm.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  handleConfirm(event) {
    const { onConfirm, onClose } = this.props;
    onConfirm(this.state.color);
    onClose();
  }

  handleDelete(event) {
    const { onDelete, onClose } = this.props;
    onDelete();
    onClose();
  }

  render() {
    const { fullScreen, open, onClose } = this.props;
    const { color } = this.state;

    return (
      <Dialog 
        fullScreen={fullScreen}
        open={open}
        onClose={onClose}
      >
        <DialogTitle>Pick a colour</DialogTitle>
        <DialogContent>
          <ColorPicker 
            color={color} 
            onChange={(color) => this.setState({ color })} 
            onConfirm={(color) => this.setState({ color })} 
          />
        </DialogContent>
        <DialogActions style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button onClick={this.handleConfirm}>Confirm</Button>
          <Button onClick={this.handleDelete}>Delete</Button>
        </DialogActions>
      </Dialog>
    )
  }
}

export default ColorPickerDialog;
