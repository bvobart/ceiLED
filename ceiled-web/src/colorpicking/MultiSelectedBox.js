import React, { Component } from 'react';
import { Paper } from '@material-ui/core';
import EditableTile from '../common/EditableTile';

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
    this.setState({ colors });
    if (onChange) onChange(colors.splice(index, 1));
  }

  render() {
    return (
      <Paper className={this.props.className}>
        {this.state.colors.map((color, index) => (
          <EditableTile 
            key={index} 
            color={color}
            onChange={(newColor) => this.handleChangeColor(newColor, index)}
            onDelete={() => this.handleDeleteColor(index)}
          />
        ))}
      </Paper>
    );
  }
}

MultiSelectedBox.defaultProps = {
  colors: []
};

export default MultiSelectedBox;
