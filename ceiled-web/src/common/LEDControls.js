import React, { Component } from 'react';
import { Card, CardHeader, Collapse, IconButton, Typography } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import GlobalControls from './GlobalControls';
import SolidTabs from '../solid/SolidTabs';

class Control extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
    }

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState({ expanded: !this.state.expanded })
  }

  render() {
    return (
      <div>
        <CardHeader 
          title={this.props.title}
          action={<IconButton onClick={this.handleClick}><ExpandMoreIcon /></IconButton>}
          onClick={this.handleClick}
        />
        <Collapse in={this.state.expanded}>
          {this.props.children}
        </Collapse>
      </div>
    );
  }
}

class LEDControls extends Component {
  render() {
    return (
      <Card>
        <GlobalControls />
        <Control title="Solid">
          <SolidTabs />
        </Control>
        <Control title="Fade">
          <Typography paragraph>Not yet implemented</Typography>
        </Control>
        <Control title="Jump">
          <Typography paragraph>Not yet implemented</Typography>
        </Control>
        <Control title="Fun">
          <Typography paragraph>Not yet implemented</Typography>
        </Control>
      </Card>
    )
  }
}

export default LEDControls;
