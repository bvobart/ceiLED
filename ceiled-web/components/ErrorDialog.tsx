import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Typography,
} from '@mui/material';
import React from 'react';
import Highlight from 'react-highlight.js';
import { InternalErrorMessage, InvalidRequestMessage } from '../api/errors';
import useCeiledErrors from '../hooks/api/useCeiledErrors';

const ErrorDialog = (): JSX.Element => {
  const [error, dismiss] = useCeiledErrors();
  if (error) {
    console.log('CeiLED returned an error: ', error);
  }

  return (
    <Dialog open={error !== null} onClose={dismiss}>
      <DialogTitle>CeiLED has encountered an error!</DialogTitle>
      <DialogContent>
        <DialogContentText>{error ? error.message : ''}</DialogContentText>
        {InternalErrorMessage.is(error) ? (
          <>
            <br />
            <TextField multiline fullWidth variant='outlined' label='Stack Trace' value={error.stackTrace} />
          </>
        ) : (
          ''
        )}
        {InvalidRequestMessage.is(error) ? (
          <>
            <Typography variant='body1'>Request</Typography>
            <Highlight language='json'>{JSON.stringify(censorAuthToken(error.request), null, 2)}</Highlight>
          </>
        ) : (
          ''
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={dismiss}>Dismiss</Button>
      </DialogActions>
    </Dialog>
  );
};

const censorAuthToken = (msg: any): any => {
  if (msg.authToken) {
    msg.authToken = '<censored>';
  }
  return msg;
};

export default ErrorDialog;
