import React, { Component } from 'react';
import { Card, CardTitle, CardText } from 'material-ui/Card';

import SolidControls from './solid/SolidControls';

class LEDControls extends Component {

  render() {
    return (
      <Card style={{ width: '100%' }}>
        <CardTitle title="Solid" />
        <CardText>
          <SolidControls />
        </CardText>
      </Card>
    );
  }
}

export default LEDControls;