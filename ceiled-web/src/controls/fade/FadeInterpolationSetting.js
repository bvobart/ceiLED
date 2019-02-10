import React, { Component } from "react";
import { Typography, Button, withStyles } from "@material-ui/core";

export const FadeInterpolations = {
  LINEAR: 'linear',
  SIGMOID: 'sigmoid',
}

const styles = theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buttonBox: {
    display: 'flex',
    flex: '1 80%',
    justifyContent: 'flexEnd',
    marginLeft: 64,
  },
  selected: {
    backgroundColor: theme.palette.action.selected,
    '&:hover': {
      '@media (hover: none)': {
        backgroundColor: theme.palette.action.selected
      }
    }
  }
})

export class FadeInterpolationSetting extends Component {
  render() {
    const { classes, onChange, value } = this.props;
    return (
      <div className={classes.root}>
        <Typography variant='caption'>Fade interpolation</Typography>
        <div className={classes.buttonBox}>
          <Button 
            className={value === FadeInterpolations.LINEAR ? classes.selected : undefined} 
            variant='outlined' 
            fullWidth 
            onClick={() => onChange(FadeInterpolations.LINEAR)}
          >
            Linear
          </Button>
          <Button 
            className={value === FadeInterpolations.SIGMOID ? classes.selected : undefined} 
            variant='outlined' 
            fullWidth 
            onClick={() => onChange(FadeInterpolations.SIGMOID)}
          >
            Sigmoid
          </Button>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(FadeInterpolationSetting);
