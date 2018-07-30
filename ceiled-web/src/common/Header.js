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
  render() {
    const { classes } = this.props;

    return (
      <ControllerSocketContext.Consumer>
        {({ enabled, enable, disable }) => (
          <CardHeader 
            title='CeiLED'
            subheader='Controlling LEDs on a ceiling near you'
            action={
              <IconButton 
                  color={enabled ? 'secondary' : 'primary'} 
                  classes={{ 
                    root: classes.powerButtonRoot, 
                    colorPrimary: classes.powerButtonPrimary, 
                    colorSecondary: classes.powerButtonSecondary 
                  }}
                  onClick={() => enabled ? disable() : enable()}
              >
                <PowerSettingsNewIcon className={classes.powerIcon} />
              </IconButton>
            }
          />
        )}
      </ControllerSocketContext.Consumer>
    )
  }
}

export default withStyles(styles)(Header);
