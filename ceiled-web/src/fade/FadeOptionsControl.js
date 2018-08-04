import React, { Component } from 'react';
import { Button, Typography, withStyles } from '@material-ui/core';

const styles = theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: '0px 24px'
  },
  buttonBox: {
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

class FadeOptionsControl extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fadeMode: props.options.fadeMode || 3,
    };
  }

  handleModeChange(fadeMode) {
    if (this.props.onChange) this.props.onChange({ ...this.state, fadeMode });
    this.setState({ fadeMode });
  }

  render() {
    const { classes } = this.props;
    const { fadeMode } = this.state;
    console.log(fadeMode);
    return (
      <div className={classes.root}>
        <Typography variant='caption'>Fade Mode</Typography>
        <div className={classes.buttonBox}>
          <Button className={fadeMode === 1 ? classes.selectedButton : undefined} fullWidth onClick={() => this.handleModeChange(1)}>Single Channel</Button>
          <Button className={fadeMode === 2 ? classes.selectedButton : undefined} fullWidth onClick={() => this.handleModeChange(2)}>Double Channel</Button>
          <Button className={fadeMode === 3 ? classes.selectedButton : undefined} fullWidth onClick={() => this.handleModeChange(3)}>Triple Channel</Button>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(FadeOptionsControl);
