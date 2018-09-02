import React, { Component } from 'react';
import { withStyles } from '@material-ui/core';
import Tile from '../common/Tile';
import CustomColorPanel from './CustomColorPanel';

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

class ColorPicker extends Component {
  render() {
    const { classes, color } = this.props;
    const onChange = this.props.onChange ? this.props.onChange : () => {};
    const onConfirm = this.props.onConfirm ? this.props.onConfirm : () => {};

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
            <Tile color={red} onClick={onConfirm} />
            <Tile color={redOrange} onClick={onConfirm} />
            <Tile color={orange} onClick={onConfirm} />
            <Tile color={orangeYellow} onClick={onConfirm} />
            <Tile color={yellow} onClick={onConfirm} />
          </div>
          <div className={classes.row}>
            <Tile color={turquoise} onClick={onConfirm} />
            <Tile color={greenBlue} onClick={onConfirm} />
            <Tile color={green} onClick={onConfirm} />
            <Tile color={yellowGreen} onClick={onConfirm} />
            <Tile color={yellowerGreen} onClick={onConfirm} />
          </div>
          <div className={classes.row}> 
            <Tile color={blueGreen} onClick={onConfirm} />
            <Tile color={blue} onClick={onConfirm} />
            <Tile color={bluePurple} onClick={onConfirm} />
            <Tile color={purpleBlue} onClick={onConfirm} />
            <Tile color={purple} onClick={onConfirm} />
          </div>
        </div>
        <div className={classes.customColorPanel}>
          <CustomColorPanel 
            color={color}
            onChange={(color) => onChange(color)}
            onClick={onConfirm}
          />
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(ColorPicker);
