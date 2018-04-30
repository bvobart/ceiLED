import React, { Component } from 'react';
import Paper from 'material-ui/Paper/Paper';

class SolidOptionsPanel extends Component {
  render() {
    return (
      <Paper style={this.props.style}>
        Options for solids.
      </Paper>
    );
  }
}

export default SolidOptionsPanel;
