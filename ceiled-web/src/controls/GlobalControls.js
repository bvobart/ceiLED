import throttle from 'lodash.throttle';
import React, { Component } from 'react';
import { Paper, withStyles, Typography } from '@material-ui/core';
import { Slider } from '@material-ui/lab';
import { ControllerSocketContext } from '../context/ControllerSocketProvider';

const DriverTypes = {
  DEBUG: "DEBUG",
  PCA9685: "PCA9685"
}

const styles = theme => ({
  root: {
    padding: '0px 16px',
    display: 'flex',
    alignContent: 'stretch',
    alignItems: 'stretch',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column'
    }
  },
  captionedSlider: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    padding: '0px 8px'
  },
  slider: {
    padding: '16px 0px'
  }
})

class GlobalControls extends Component {
  constructor(props) {
    super(props);
    this.state = {
      brightness: 100,
      roomLight: 0,
      flux: -1,
      driverType: DriverTypes.PCA9685,
    };

    this.handleBrightnessChange = this.handleBrightnessChange.bind(this);
    this.handleRoomLightChange = this.handleRoomLightChange.bind(this);
    this.handleFluxChange = this.handleFluxChange.bind(this);
    this.handleDriverChange = this.handleDriverChange.bind(this);
    
    this.authToken = localStorage.getItem('authToken');
    this.setSettings = throttle(this.setSettings, 200);
  }

  handleBrightnessChange(brightness) {
    this.setState({ brightness });
    this.setSettings({ brightness });
  }

  handleRoomLightChange(roomLight) {
    this.setState({ roomLight });
    this.setSettings({ roomLight });
  }

  handleFluxChange(flux) {
    this.setState({ flux });
    this.setSettings({ flux });
  }

  handleDriverChange(driverType) {
    this.setState({ driverType });
    this.setSettings({ driverType });
  }

  setSettings(newSettings) {
    this.send({
      settings: {
        action: 'set',
        ...this.state, 
        ...newSettings
      },
      authToken: this.authToken
    })
  }

  render() {
    const { classes, hidden } = this.props;
    const { brightness, roomLight, flux } = this.state;

    if (hidden) return (<div />)
    return (
      <ControllerSocketContext.Consumer>
        {({ send }) => {
          this.send = send;
          return (
            <Paper className={classes.root} elevation={0}>
              <div className={classes.captionedSlider}>
                <Typography variant='caption'>Brightness: {brightness}%</Typography>
                <Slider 
                  className={classes.slider}
                  step={1} 
                  value={brightness} 
                  onChange={(e, newBrightness) => this.handleBrightnessChange(newBrightness)}
                />
              </div>
              <div className={classes.captionedSlider}>
                <Typography variant='caption'>Room light: {roomLight}%</Typography>
                <Slider 
                  className={classes.slider}
                  step={1} 
                  value={roomLight} 
                  onChange={(e, newRoomLight) => this.handleRoomLightChange(newRoomLight)}
                />
              </div>
              <div className={classes.captionedSlider}>
                <Typography variant='caption'>Flux: {flux === -1 ? 'AUTO' : flux}</Typography>
                <Slider 
                  className={classes.slider}
                  step={1}
                  min={-1}
                  max={5}
                  value={flux}
                  onChange={(e, newFlux) => this.handleFluxChange(newFlux)}
                />
              </div>
              {/* <div className={classes.captionedSlider}>
                <Typography variant='caption'>DriverType:</Typography>
                <Select
                  value={driverType}
                  onChange={this.handleDriverChange}
                >
                  <MenuItem value={DriverTypes.DEBUG}>{DriverTypes.DEBUG}</MenuItem>
                  <MenuItem value={DriverTypes.PCA9685}>{DriverTypes.PCA9685}</MenuItem>
                </Select>
              </div> */}
            </Paper>
          );
        }}
      </ControllerSocketContext.Consumer>
    );
  }
}

export default withStyles(styles)(GlobalControls);
