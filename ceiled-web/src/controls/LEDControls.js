import React, { Component } from 'react';
import { Card, CardHeader, Collapse, IconButton } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import GlobalControls from './GlobalControls';
import FadeControls from './fade/FadeControls';
import SolidControls from './solid/SolidControls';
import JumpControls from './jump/JumpControls';
import FunControls from './fun/FunControls';
import ComfortControls from './comfort/ComfortControls';

class Control extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: props.expanded || false,
    }

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState({ expanded: !this.state.expanded })
  }

  render() {
    const { hidden } = this.props;

    return (
      <div>
        { !hidden && 
          <CardHeader 
            title={this.props.title}
            action={<IconButton onClick={this.handleClick}><ExpandMoreIcon /></IconButton>}
            onClick={this.handleClick}
          />
        }
        <Collapse in={!hidden && this.state.expanded}>
          {this.props.children}
        </Collapse>
      </div>
    );
  }
}

class LEDControls extends Component {
  render() {
    const { hidden } = this.props;
    return (
      <Card>
        <GlobalControls hidden={hidden}/>
        <Control title="Comfort" hidden={hidden} expanded={true}>
          <ComfortControls />
        </Control>
        <Control title="Solids" hidden={hidden}>
          <SolidControls />
        </Control>
        <Control title="Fades" hidden={hidden}>
          <FadeControls />
        </Control>
        <Control title="Jumps" hidden={hidden}>
          <JumpControls />
        </Control>
        <Control title="Fun" hidden={hidden}>
          <FunControls />
        </Control>
      </Card>
    )
  }
}

export default LEDControls;
