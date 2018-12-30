import React, { Component } from 'react';
import { CardHeader, withStyles, IconButton } from '@material-ui/core';
import green from '@material-ui/core/colors/green';
import red from '@material-ui/core/colors/red';
import { fade } from '@material-ui/core/styles/colorManipulator';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNewRounded';

import { ControllerSocketContext } from '../context/ControllerSocketProvider';

const styles = theme => ({
  powerIcon: {
    height: '72px',
    width: '72px'
  },
  powerButtonRoot: {
    height: '72px',
    width: '72px'
  },
  powerButtonPrimary: {
    color: red[900],
    '&:hover': {
      backgroundColor: fade(green['A700'], theme.palette.action.hoverOpacity),
      // Reset on touch devices, it doesn't add specificity
      '@media (hover: none)': {
        backgroundColor: 'transparent',
      },
    },
  },
  powerButtonSecondary: {
    color: green['A700'],
    '&:hover': {
      backgroundColor: fade(red['A700'], theme.palette.action.hoverOpacity),
      // Reset on touch devices, it doesn't add specificity
      '@media (hover: none)': {
        backgroundColor: 'transparent',
      },
    },
  }
});

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: WebSocket.CLOSED
    }
    this.refresh = this.refresh.bind(this);
  }
  
  refresh() {
    const status = this.getStatus();
    if (status === WebSocket.CLOSED) {
      this.open(this.address ? this.address : 'ws://localhost:6565').then(() => 
        this.setState({ status: this.getStatus() })
      );
    }
    this.setState({ status });
  }

  render() {
    const { classes } = this.props;

    return (
      <ControllerSocketContext.Consumer>
        {({ address, getStatus, open, send, turnOff }) => {
          this.address = address;
          this.getStatus = getStatus;
          this.open = open;
          this.send = send;
          this.turnOff = turnOff;
          return (
            <CardHeader 
              title='CeiLED'
              subheader='Controlling LEDs on a ceiling near you'
              action={
                <IconButton 
                    color={getStatus() === WebSocket.OPEN ? 'secondary' : 'primary'} 
                    classes={{ 
                      root: classes.powerButtonRoot, 
                      colorPrimary: classes.powerButtonPrimary, 
                      colorSecondary: classes.powerButtonSecondary 
                    }}
                    onClick={this.refresh}
                    onDoubleClick={turnOff}
                >
                  <PowerSettingsNewIcon className={classes.powerIcon} />
                </IconButton>
              }
            />
          );
        }}
      </ControllerSocketContext.Consumer>
    )
  }
}

export default withStyles(styles)(Header);
