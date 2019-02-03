import React, { Component } from 'react';
import { withStyles } from '@material-ui/core';
import ColorTile from '../common/tiles/ColorTile';
import CustomColorPanel from './CustomColorPanel';

const styles = theme => ({
  customColorPanel: {
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
    const { classes, className, color } = this.props;
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
      <div className={className}>
        <div className={classes.root}>
          <div className={classes.colorRows}>
            <div className={classes.row}> 
              <ColorTile color={red} onClick={onConfirm} />
              <ColorTile color={redOrange} onClick={onConfirm} />
              <ColorTile color={orange} onClick={onConfirm} />
              <ColorTile color={orangeYellow} onClick={onConfirm} />
              <ColorTile color={yellow} onClick={onConfirm} />
            </div>
            <div className={classes.row}>
              <ColorTile color={turquoise} onClick={onConfirm} />
              <ColorTile color={greenBlue} onClick={onConfirm} />
              <ColorTile color={green} onClick={onConfirm} />
              <ColorTile color={yellowGreen} onClick={onConfirm} />
              <ColorTile color={yellowerGreen} onClick={onConfirm} />
            </div>
            <div className={classes.row}> 
              <ColorTile color={blueGreen} onClick={onConfirm} />
              <ColorTile color={blue} onClick={onConfirm} />
              <ColorTile color={bluePurple} onClick={onConfirm} />
              <ColorTile color={purpleBlue} onClick={onConfirm} />
              <ColorTile color={purple} onClick={onConfirm} />
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
      </div>
    );
  }
}

export default withStyles(styles)(ColorPicker);
