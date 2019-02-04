import React, { Component } from 'react';
import { Dialog, DialogTitle, DialogContent, Typography } from '@material-ui/core';

class UnauthorisedDialog extends Component {
  render() {
    const { open, onClose } = this.props;
    return (
      <Dialog
        open={open}
        onBackdropClick={onClose}
        onClick={onClose}
      >
        <DialogTitle>Error - Unauthorised</DialogTitle>
        <DialogContent>
          <Typography>
            The controller did not accept your authorisation token. You are therefore not allowed
            to perform that operation. See the about page for more info.
          </Typography>
        </DialogContent>
      </Dialog>
    )
  }
}

export default UnauthorisedDialog;
