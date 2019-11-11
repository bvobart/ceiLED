import React from 'react';
import { Button, Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText, TextField } from '@material-ui/core';
import useCeiledErrors from '../hooks/useCeiledErrors';
import { InternalErrorMessage } from '../api/responses';

interface ErrorDialogProps {}

const ErrorDialog = (props: ErrorDialogProps) => {
  const [error, dismiss] = useCeiledErrors();
  if (error) {
    console.log('CeiLED returned an error: ', error);
  }

  return (
    <Dialog open={error !== null} onClose={dismiss}>
      <DialogTitle>CeiLED has encountered an error!</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {error ? error.message : ''}
        </DialogContentText>
        {InternalErrorMessage.is(error)
          ? <><br/><TextField
              multiline
              fullWidth
              variant='outlined' 
              label='Stack Trace'
              value={error.stackTrace} 
            /></>
          : ''
        }
      </DialogContent>
      <DialogActions>
        <Button onClick={dismiss}>Dismiss</Button>
      </DialogActions>
    </Dialog>
  )
}

export default ErrorDialog;
