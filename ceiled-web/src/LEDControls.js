import React, { Component } from 'react';
import { Card, CardTitle, CardText } from 'material-ui/Card';

import FadeControls from './fade/FadeControls';
import FunControls from './fun/FunControls';
import JumpControls from './jump/JumpControls';
import SolidControls from './solid/SolidControls';

class LEDControls extends Component {
  render() {
    return (
      <div>
        <Card initiallyExpanded style={{ width: '100%' }} >
          <CardTitle actAsExpander showExpandableButton title="Solids" />
          <CardText expandable >
            <SolidControls />
          </CardText>
        </Card>
        <Card initiallyExpanded style={{ width: '100%' }} >
          <CardTitle actAsExpander showExpandableButton title="Fades" />
          <CardText expandable >
            <FadeControls />
          </CardText>
        </Card>
        <Card initiallyExpanded style={{ width: '100%' }} >
          <CardTitle actAsExpander showExpandableButton title="Jumps" />
          <CardText expandable >
            <JumpControls />
          </CardText>
        </Card>
        <Card initiallyExpanded style={{ width: '100%' }} >
          <CardTitle actAsExpander showExpandableButton title="For fun :P" />
          <CardText expandable >
            <FunControls />
          </CardText>
        </Card>
      </div>
    );
  }
}

export default LEDControls;