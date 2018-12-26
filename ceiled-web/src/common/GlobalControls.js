import React, { Component } from 'react';
import { Paper, withStyles, Typography } from '@material-ui/core';
import { Slider } from '@material-ui/lab';
import { ControllerSocketContext } from '../context/ControllerSocketProvider';

const styles = theme => ({
  root: {
    padding: '0px 24px',
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
    width: '100%'
  },
  slider: {
    padding: '16px 0px'
  }
})

class GlobalControls extends Component {
  constructor(props) {
    super(props);
    this.state = {
      brightness: 0,
      roomLight: 0,
    };

    this.handleBrightnessChange = this.handleBrightnessChange.bind(this);
    this.handleRoomLightChange = this.handleRoomLightChange.bind(this);
  }

  handleBrightnessChange(brightness, callback) {
    this.setState({ brightness });
    callback(brightness);
  }

  handleRoomLightChange(roomLight, callback) {
    this.setState({ roomLight });
    callback(roomLight);
  }

  render() {
    const { classes } = this.props;

    return (
      <ControllerSocketContext.Consumer>
        {({ setBrightness, setRoomLight }) => (
          <Paper className={classes.root} elevation={0}>
            <div className={classes.captionedSlider}>
              <Typography variant='caption'>Brightness</Typography>
              <Slider 
                className={classes.slider}
                step={1} 
                value={this.state.brightness} 
                onChange={(e, brightness) => this.handleBrightnessChange(brightness, setBrightness)}
              />
            </div>
            <div className={classes.captionedSlider}>
              <Typography variant='caption'>Room light</Typography>
              <Slider 
                className={classes.slider}
                step={1} 
                value={this.state.roomLight} 
                onChange={(e, roomLight) => this.handleRoomLightChange(roomLight, setRoomLight)}
              />
            </div>
          </Paper>
        )}
      </ControllerSocketContext.Consumer>
    );
  }
}

export default withStyles(styles)(GlobalControls);
