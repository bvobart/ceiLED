import React, { Component } from 'react';
import { Paper, withStyles } from '@material-ui/core';
import { Slider } from '@material-ui/lab';
import Tile from '../common/Tile';

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  tile: {
    height: 50,
    display: 'flex',
    marginTop: 4
  },
  slider: {
    padding: '16px 0px'
  }
});

const ColorSlider = (props) => (
  <Slider
    className={props.className}
    step={1} 
    min={0} 
    max={255} 
    onChange={props.onChange}
    value={props.value}
  />
);

class CustomColorPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      red: props.color ? props.color.red : 0,
      green: props.color ? props.color.green : 0,
      blue: props.color ? props.color.blue : 0
    };

    this.handleChangeRed = this.handleChangeRed.bind(this);
    this.handleChangeGreen = this.handleChangeGreen.bind(this);
    this.handleChangeBlue = this.handleChangeBlue.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  static getDerivedStateFromProps(props, state) {
    if (props.color.red !== state.red 
        || props.color.green !== state.green 
        || props.color.blue !== state.blue
    ) {
      return props.color;
    }
    return null;
  }

  handleChangeRed(e, red) {
    const newColor = { ...this.state, red };
    this.props.onChange && this.props.onChange(newColor);
    this.setState(newColor);
  }

  handleChangeGreen(e, green) {
    const newColor = { ...this.state, green };
    this.props.onChange && this.props.onChange(newColor);
    this.setState(newColor);
  }

  handleChangeBlue(e, blue) {
    const newColor = { ...this.state, blue };
    this.props.onChange && this.props.onChange(newColor);
    this.setState(newColor);
  }

  handleClick(event) {
    this.props.onClick && this.props.onClick(this.state);
  }

  render() {
    const { classes, label } = this.props;
    return (
      <Paper square className={classes.root}>
        <div>
          <ColorSlider className={classes.slider} value={this.state.red} onChange={this.handleChangeRed} />
          <ColorSlider className={classes.slider} value={this.state.green} onChange={this.handleChangeGreen} />
          <ColorSlider className={classes.slider} value={this.state.blue} onChange={this.handleChangeBlue} />
        </div>
        <Tile label={label} className={classes.tile} color={this.state} onClick={this.handleClick} />
      </Paper>
    );
  }
}

export default withStyles(styles)(CustomColorPanel);
