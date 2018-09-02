import React, { Component } from 'react';
import { Button, Typography, withStyles } from '@material-ui/core';
import { Slider } from '@material-ui/lab';
import debounce from 'debounce';

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    margin: '0px 24px 6px'
  },
  optionBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputBox: {
    flex: '1 80%',
    display: 'flex',
    justifyContent: 'flexEnd',
    marginLeft: 64
  },
  selectedButton: {
    backgroundColor: theme.palette.action.selected,
    '&:hover': {
      '@media (hover: none)': {
        backgroundColor: theme.palette.action.selected
      }
    }
  }
});

class JumpOptionsControl extends Component {
  constructor(props) {
    super(props);
    this.state = {
      jumpMode: props.options.jumpMode || 3,
      speed: props.options.speed || 60
    };

    this.debouncedOnChange = debounce(props.onChange, 65);
  }

  handleModeChange(jumpMode) {
    if (this.props.onChange) this.props.onChange({ ...this.state, jumpMode });
    this.setState({ jumpMode });
  }

  handleSpeedChange(e, speed) {
    if (this.props.onChange) this.debouncedOnChange({ ...this.state, speed });
    this.setState({ speed });
  }

  render() {
    const { classes } = this.props;
    const { jumpMode, speed } = this.state;
    return (
      <div className={classes.root}>
        <div className={classes.optionBox}>
          <Typography variant='caption'>Jump Mode</Typography>
          <div className={classes.inputBox}>
            <Button className={jumpMode === 1 ? classes.selectedButton : undefined} fullWidth onClick={() => this.handleModeChange(1)}>Single Channel</Button>
            <Button className={jumpMode === 2 ? classes.selectedButton : undefined} fullWidth onClick={() => this.handleModeChange(2)}>Double Channel</Button>
            <Button className={jumpMode === 3 ? classes.selectedButton : undefined} fullWidth onClick={() => this.handleModeChange(3)}>Triple Channel</Button>
          </div>
        </div>
        <div className={classes.optionBox}>
          <Typography variant='caption'>Speed</Typography>
          <div className={classes.inputBox}>
            <Typography variant='caption'>{speed} BPM</Typography>
            <Slider value={speed} min={30} max={300} step={1} onChange={this.handleSpeedChange.bind(this)} />
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(JumpOptionsControl);
