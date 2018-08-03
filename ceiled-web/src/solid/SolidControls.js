import React, { Component } from 'react';
import CustomColorPanel from './CustomColorPanel';
import Tile from '../common/Tile';
import { withStyles } from '@material-ui/core';

const styles = theme => ({
  customColorPanel: {
    padding: '10',
    flex: '1 40%'
  },
  colorRows: {
    flex: '1 60%'
  },
  row: {
    display: 'flex'
  },
  root: {
    display: 'flex',
    flexFlow: 'row wrap',
  }
});

class SolidControls extends Component {
  constructor(props) {
    super(props);
    this.state = {
      color: {
        red: Math.round(Math.random() * 255),
        green: Math.round(Math.random() * 255),
        blue: Math.round(Math.random() * 255),
      }
    };

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event, color) {
    this.setState({ color });
    // const socket = new WebSocket('ws://localhost:6565');
    // socket.onopen = event => {
    //   const request = {
    //     data: {
    //       type: 'solid',
    //       colors: [color],
    //       brightness: 100,
    //       roomLight: 0
    //     }
    //   };
    //   socket.send(JSON.stringify(request));
    //   socket.close();
    // };
  }
  
  render() {
    const { classes } = this.props;

    const red = { red: 255, green: 0, blue: 0 };
    const redOrange = { red: 255, green: 64, blue: 0 };
    const orange = { red: 255, green: 127, blue: 0 };
    const orangeYellow = { red: 255, green: 192, blue: 0 };
    const yellow = { red: 255, green: 255, blue: 0 };

    const yellowerGreen = { red: 192, green: 255, blue: 0 };
    const yellowGreen = { red: 127, green: 255, blue: 0 };
    const green = { red: 0, green: 255, blue: 0 };
    const greenBlue = { red: 0, green: 255, blue: 127 };
    const turquoise = { red: 0, green: 255, blue: 255 };

    const blueGreen = { red: 0, green: 127, blue: 255 };
    const blue = { red: 0, green: 0, blue: 255 };
    const bluePurple = { red: 127, green: 0, blue: 255 };
    const purpleBlue = { red: 192, green: 0, blue: 255 };
    const purple = { red: 255, green: 0, blue: 255 };

    return (
      <div className={classes.root}>
        <div className={classes.colorRows}>
          <div className={classes.row}> 
            <Tile color={red} onClick={this.handleClick} />
            <Tile color={redOrange} onClick={this.handleClick} />
            <Tile color={orange} onClick={this.handleClick} />
            <Tile color={orangeYellow} onClick={this.handleClick} />
            <Tile color={yellow} onClick={this.handleClick} />
          </div>
          <div className={classes.row}>
            <Tile color={turquoise} onClick={this.handleClick} />
            <Tile color={greenBlue} onClick={this.handleClick} />
            <Tile color={green} onClick={this.handleClick} />
            <Tile color={yellowGreen} onClick={this.handleClick} />
            <Tile color={yellowerGreen} onClick={this.handleClick} />
          </div>
          <div className={classes.row}> 
            <Tile color={blueGreen} onClick={this.handleClick} />
            <Tile color={blue} onClick={this.handleClick} />
            <Tile color={bluePurple} onClick={this.handleClick} />
            <Tile color={purpleBlue} onClick={this.handleClick} />
            <Tile color={purple} onClick={this.handleClick} />
          </div>
        </div>
        <div className={classes.customColorPanel}>
          <CustomColorPanel color={this.state.color} />
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(SolidControls);
