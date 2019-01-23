import React, { Component } from 'react';
import { CardContent, Typography, TextField, withStyles, Button } from '@material-ui/core';
import { ControllerSocketContext } from '../../context/ControllerSocketProvider';
import { getApiUrl } from '../utils';
import StatusBox from './StatusBox';

const styles = theme => ({
  root: {
    display: 'flex',
    flexFlow: 'row wrap',
    justifyContent: 'space-between'
  },
  addressBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  actionBox: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  actionButton: {
    width: '90px',
  },
  statusBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  }
});

class Footer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addressDisabled: false,
      address: process.env.NODE_ENV === 'development' ? 'localhost:3000' : 'bart.vanoort.is',
      hasError: false,
    }
  }

  componentWillUnmount() {
    this.close();
  }

  handleConnect() {
    if (this.state.address) {
      const secure = process.env.NODE_ENV !== 'development';
      const address = getApiUrl(this.state.address, secure);
      this.open(address)
        .then(() => {
          console.log('Connected to', address);
          this.setState({ addressDisabled: true, hasError: false });
        })
        .catch((event) => {
          console.error('Error connecting to controller. Is the address correct?');
          console.error(event);
          this.setState({ hasError: true });
        });
    }
  }
  
  handleRefreshStatus() {
    this.setState({ hasError: false })
  }
  
  render() {
    const { classes, displayAbout, toggleAboutPage } = this.props;
    const { addressDisabled, address, hasError } = this.state;

    return (
      <ControllerSocketContext.Consumer>
        {({ open, close, status }) => {
          this.open = open;
          this.close = close;
          return (
            <CardContent className={classes.root}>
              <StatusBox status={hasError ? WebSocket.CLOSED : status} error={hasError}/>
              <div className={classes.actionBox}>
                <Button 
                  className={classes.actionButton} 
                  variant='text'
                  onClick={toggleAboutPage}
                >
                  { displayAbout ? 'CONTROLS' : 'ABOUT' }
                </Button>
                <Button
                  className={classes.actionButton}
                  variant='text' 
                  onClick={() => this.handleConnect()}
                >
                  Connect
                </Button>
              </div>
              <div className={classes.addressBox}>
                <Typography variant='caption'>
                  Address:
                </Typography>
                <TextField 
                  disabled={addressDisabled} 
                  onChange={(event) => this.setState({ address: event.target.value })}
                  onKeyDown={(event) => event.key === 'Enter' ? this.handleConnect() : undefined }
                  onDoubleClick={(event) => this.setState({ addressDisabled: !addressDisabled })}
                  value={address}
                  style={{ paddingLeft: 8 }}
                ></TextField>
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
