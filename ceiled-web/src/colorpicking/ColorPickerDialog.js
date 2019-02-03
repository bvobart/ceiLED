import React, { Component } from 'react';
import { Dialog, DialogTitle, DialogActions, Button, withStyles } from '@material-ui/core';
import ColorPicker from './ColorPicker';

const styles = theme => ({
  actions: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  dialogPaper: {
    margin: 0,
    overflowX: 'hidden',
    minWidth: window.innerWidth,
    [theme.breakpoints.up('sm')]: {
      minWidth: 600,
      maxWidth: 600
    }
  }
});

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
    const { classes, fullScreen, open, onClose } = this.props;
    const { color } = this.state;

    return (
      <Dialog
        classes={{
          paper: classes.dialogPaper,
        }}
        fullScreen={fullScreen}
        open={open}
        onBackdropClick={this.handleConfirm}
        onClose={onClose}
      >
        <DialogTitle>Pick a colour</DialogTitle>
        <ColorPicker 
          color={color}
          onChange={(color) => this.setState({ color })} 
          onConfirm={(color) => {
            this.setState({ color }, this.handleConfirm);
          }} 
        />
        <DialogActions className={classes.actions}>
          <Button onClick={this.handleConfirm}>Confirm</Button>
          <Button onClick={this.handleDelete}>Delete</Button>
        </DialogActions>
      </Dialog>
    )
  }
}

export default withStyles(styles)(ColorPickerDialog);
