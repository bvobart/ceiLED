import React, { Component } from 'react';
import { CardContent, Typography, TextField, withStyles, Button } from '@material-ui/core';
import { ControllerSocketContext } from '../context/ControllerSocketProvider';

const styles = theme => ({
  root: {
    display: 'flex',
    flexFlow: 'row wrap',
    justifyContent: 'space-between'
  },
  connectBox: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  statusBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  }
});

const Status = {
  closed: 'Closed',
  closing: 'Closing',
  connected: 'Connected',
  connecting: 'Connecting',
  error: 'Error, see console',
  unknown: 'Unknown'
};

class Footer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addressDisabled: false,
      address: process.env.NODE_ENV === 'development' ? 'localhost:3000' : '192.168.0.165',
      status: Status.closed,
    }
  }

  componentWillUnmount() {
    this.close();
  }

  getStatusText(status) {
    switch (status) {
      case WebSocket.OPEN: return Status.connected;
      case WebSocket.CLOSED: return Status.closed;
      case WebSocket.CLOSING: return Status.closing;
      case WebSocket.CONNECTING: return Status.connecting;
      default: return Status.unknown; 
    }
  }

  handleConnect() {
    if (this.state.address) {
      const address = 'wss://' + this.state.address + '/ceiled-api';
      this.open(address)
      .then(() => {
        console.log('Connected to', address);
        this.setState({ addressDisabled: true, status: Status.connected });
      })
      .catch((event) => {
        console.error('Error connecting to controller. Is the address correct?');
        console.error(event);
        this.setState({ status: Status.error });
      });

      this.setState({ status: Status.connecting });
    }
  }
  
  handleRefreshStatus({ getStatus }) {
    this.setState({ status: this.getStatusText(getStatus())})
  }
  
  render() {
    const { classes } = this.props;
    const { addressDisabled, address, status} = this.state;

    return (
      <ControllerSocketContext.Consumer>
        {({ getStatus, open, close }) => {
          this.open = open;
          this.close = close;
          return (
            <CardContent className={classes.root}>
              <div className={classes.statusBox}>
                <Typography 
                  variant='caption' 
                  style={{ padding: 10 }}
                >
                  Status: {status}
                </Typography>
                <Button 
                  variant='outlined' 
                  onClick={() => this.handleRefreshStatus({ getStatus })}
                >Refresh</Button>
              </div>
              <div className={classes.connectBox}>
                <Typography 
                  variant='caption' 
                  style={{ padding: 10 }}
                >
                  Address:
                </Typography>
                <TextField 
                  disabled={addressDisabled} 
                  onChange={(event) => this.setState({ address: event.target.value })}
                  onKeyDown={(event) => event.key === 'Enter' ? this.handleConnect() : undefined }
                  onDoubleClick={(event) => this.setState({ addressDisabled: !addressDisabled })}
                  style={{ paddingRight: 10 }}
                  value={address}
                ></TextField>
                <Button
                  variant='outlined' 
                  onClick={() => this.handleConnect()}
                >
                  Connect
                </Button>
              </div>
            </CardContent>
          );
        }
        }
      </ControllerSocketContext.Consumer>
    )
  }
}

export default withStyles(styles)(Footer);
