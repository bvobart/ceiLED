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
  render() {
    const { classes } = this.props;
    const onChange = this.props.onChange ? this.props.onChange : () => {};

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
            <Tile color={red} onClick={onChange} />
            <Tile color={redOrange} onClick={onChange} />
            <Tile color={orange} onClick={onChange} />
            <Tile color={orangeYellow} onClick={onChange} />
            <Tile color={yellow} onClick={onChange} />
          </div>
          <div className={classes.row}>
            <Tile color={turquoise} onClick={onChange} />
            <Tile color={greenBlue} onClick={onChange} />
            <Tile color={green} onClick={onChange} />
            <Tile color={yellowGreen} onClick={onChange} />
            <Tile color={yellowerGreen} onClick={onChange} />
          </div>
          <div className={classes.row}> 
            <Tile color={blueGreen} onClick={onChange} />
            <Tile color={blue} onClick={onChange} />
            <Tile color={bluePurple} onClick={onChange} />
            <Tile color={purpleBlue} onClick={onChange} />
            <Tile color={purple} onClick={onChange} />
          </div>
        </div>
        <div className={classes.customColorPanel}>
          <CustomColorPanel color={this.props.color} onChange={(color) => onChange(null, color)} />
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(SolidControls);
