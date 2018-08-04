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
});

const ColorSlider = (props) => (
  <Slider 
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
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.color !== this.props.color && this.props.color !== prevState && this.props.color !== this.state) {
      this.setState({ ...this.props.color });
    } else if (this.state !== prevState) {
      this.props.onChange && this.props.onChange(this.state);
    }
  }

  render() {
    const { classes } = this.props;
    return (
      <Paper square className={classes.root}>
        <div>
          <ColorSlider value={this.state.red} onChange={(e, red) => this.setState({ red })} />
          <ColorSlider value={this.state.green} onChange={(e, green) => this.setState({ green })}/>
          <ColorSlider value={this.state.blue} onChange={(e, blue) => this.setState({ blue })}/>
        </div>
        <Tile className={classes.tile} color={this.state} />
      </Paper>
    );
  }
}

export default withStyles(styles)(CustomColorPanel);
