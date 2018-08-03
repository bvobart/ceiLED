import React, { Component } from 'react';
import { Paper, withStyles, Button } from '@material-ui/core';
import { Slider } from '@material-ui/lab';
import Tile from '../common/Tile';

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  buttonBox: {
    height: 50,
    display: 'flex',
    marginTop: 4
  },
  button: {
    flex: '1 50%'
  }
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
    if (prevProps.color !== this.props.color) {
      this.setState({ ...this.props.color });
    } else {
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
        <div className={classes.buttonBox}>
          <Tile flex='1 50%' color={this.state} />
          <Button className={classes.button}>Confirm</Button>
        </div>       
      </Paper>
    );
  }
}

export default withStyles(styles)(CustomColorPanel);
