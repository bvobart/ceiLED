import React, { Component } from "react";
import { Typography, withStyles } from "@material-ui/core";


const Status = {
  closed: 'Closed',
  closing: 'Closing',
  connected: 'Connected',
  connecting: 'Connecting',
  error: 'Error, see console',
  unknown: 'Unknown'
};

const styles = theme => ({
  root: {
    display: 'flex',
    flexFlow: 'column wrap',
    justifyContent: 'center'
  },
  statusText: { padding: 10 }
});

class StatusBox extends Component {

  getStatusText(status) {
    switch (status) {
      case WebSocket.OPEN: return Status.connected;
      case WebSocket.CLOSED: return Status.closed;
      case WebSocket.CLOSING: return Status.closing;
      case WebSocket.CONNECTING: return Status.connecting;
      default: return Status.unknown; 
    }
  }

  render() {
    const { classes, status, error } = this.props;

    return (
      <div className={classes.root}>
        <Typography variant='caption'>
          Status: {this.getStatusText(status)}
        </Typography>
        { error && 
          <Typography variant='caption' color='error'>
            There were errors, see the console...
          </Typography>
        }
      </div>
    );
  }
}

export default withStyles(styles)(StatusBox);
