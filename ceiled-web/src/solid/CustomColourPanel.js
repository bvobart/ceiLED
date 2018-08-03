import React, { Component } from 'react';
import { Paper } from '@material-ui/core';

class CustomColourPanel extends Component {
  render() {
    return (
      <Paper style={this.props.style}>
        Way to apply custom colours.
      </Paper>
    );
  }
}

export default CustomColourPanel;
