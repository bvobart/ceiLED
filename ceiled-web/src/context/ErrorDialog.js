import React, { Component } from 'react';
import { Dialog, DialogTitle, DialogContent, Typography, TextField, DialogActions, Button } from '@material-ui/core';

class ErrorDialog extends Component {
  renderErrorFields() {
    const { errors } = this.props;
    if (!errors) {
      return (
        <Typography gutterBottom style={{ marginTop: 12 }}>
          No further error info returned by the server. Maybe there's more in the developer console?
          Otherwise, ask your nearest CeiLED developer to check the controller's logs, because this is 
          not supposed to happen...
        </Typography>
      );
    }
    
    return errors.map((errorMsg, index) => (
      <TextField
        key={index}
        fullWidth
        error
        multiline
        variant='outlined'
        label={errorMsg.message}
        value={errorMsg.stackTrace}
        InputProps={{ readOnly: true }}
        style={{ whiteSpace: 'pre-line', marginTop: 12 }}
      />
    ));
  }

  render() {
    const { open, onClose } = this.props;
    return (
      <Dialog
        open={open}
        onBackdropClick={onClose}
      >
        <DialogTitle>Error - Problem in the Controller</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            The CeiLED controller encountered one or more errors while processing your request.
            Error messages and stack traces are given below, if available.
          </Typography>
          { this.renderErrorFields() }
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>OK</Button>
        </DialogActions>
      </Dialog>
    )
  }
}

export default ErrorDialog;
