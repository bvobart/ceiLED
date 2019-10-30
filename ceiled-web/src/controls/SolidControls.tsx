import React from 'react';
import { ExpansionPanel, ExpansionPanelSummary, Typography, ExpansionPanelDetails } from '@material-ui/core';

const SolidControls = () => {
  return (
    <ExpansionPanel>
      <ExpansionPanelSummary>
        <Typography variant='h6'>Solids</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <Typography>TODO: solid colour controls</Typography>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  )
}

export default SolidControls;
