import React from 'react';
import { Button, Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText, TextField, Typography } from '@material-ui/core';
import { InternalErrorMessage, InvalidRequestMessage } from '../api/errors';
import useCeiledErrors from '../hooks/api/useCeiledErrors';
import Highlight from 'react-highlight.js';

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
        {InvalidRequestMessage.is(error)
          ? <>
              <Typography variant='body1'>Request</Typography>
              <Highlight language='json'>
                {JSON.stringify(censorAuthToken(error.request), null, 2)}
              </Highlight>
            </>
          : ''
        }
      </DialogContent>
      <DialogActions>
        <Button onClick={dismiss}>Dismiss</Button>
      </DialogActions>
    </Dialog>
  )
}

const censorAuthToken = (msg: any): any => {
  if (msg.authToken) {
    msg.authToken = '<censored>';
  }
  return msg;
}

export default ErrorDialog;
