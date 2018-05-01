import React, { Component } from 'react';
import { Card, CardTitle, CardText } from 'material-ui/Card';
import Slider from 'material-ui/Slider';

import FadeControls from './fade/FadeControls';
import FunControls from './fun/FunControls';
import JumpControls from './jump/JumpControls';
import SolidControls from './solid/SolidControls';

class LEDControls extends Component {
  constructor(props) {
    super(props);
    this.state = {
      brightness: 100,
      roomLight: 0
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.enabled) { 
      this.setState({ brightness: 0 });
    } else {
      this.setState({ brightness: 100 });
    }
  }

  render() {
    return (
      <div>
        <Card>
          <CardText style={{ display: 'flex', flexFlow: 'column nowrap' }}>
            Brightness: {this.state.brightness}
            <Slider 
              min={0} 
              max={100}
              step={1}
              value={this.state.brightness}
              disabled={!this.props.enabled}
              onChange={(event, newValue) => this.setState({ brightness: newValue })}
              sliderStyle={{ marginTop: 10, marginBottom: 10 }} 
            />
            Roomlight: {this.state.roomLight}
            <Slider 
              min={0} 
              max={100}
              step={1}
              value={this.state.roomLight}
              disabled={!this.props.enabled}
              onChange={(event, newValue) => this.setState({ roomLight: newValue })}
              sliderStyle={{ marginTop: 10, marginBottom: 10 }} 
            />
          </CardText>
        </Card>
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