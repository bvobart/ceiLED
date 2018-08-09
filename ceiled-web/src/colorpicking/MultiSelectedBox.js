import React, { Component } from 'react';
import { Paper, Typography, withStyles } from '@material-ui/core';
import EditableTile from '../common/EditableTile';

const styles = theme => ({
  root: {},
})

class MultiSelectedBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      colors: props.colors || []
    }
    this.handleChangeColor = this.handleChangeColor.bind(this);
  }

  handleChangeColor(color, index) {
    const { colors, onChange } = this.props;
    colors[index] = color;
    this.setState({ colors });
    if (onChange) onChange(colors);
  }

  handleDeleteColor(index) {
    const { colors, onChange } = this.props;
    colors.splice(index, 1);
    this.setState({ colors });
    if (onChange) onChange(colors);
  }

  render() {
    const { classes, className, label } = this.props;

    return (
      <div className={className}>
        <Paper className={classes.root}>
        {label && <Typography variant='caption'>{label}</Typography> }
          {this.props.colors.map((color, index) => (
            <EditableTile 
              key={index} 
              color={color}
              onChange={(newColor) => this.handleChangeColor(newColor, index)}
              onDelete={() => this.handleDeleteColor(index)}
            />
          ))}
        </Paper>
      </div>
    );
  }
}

MultiSelectedBox.defaultProps = {
  colors: []
};

export default withStyles(styles)(MultiSelectedBox);
