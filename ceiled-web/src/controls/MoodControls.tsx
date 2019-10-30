import React from 'react';
import { Card, CardContent, Typography, ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary } from '@material-ui/core';

const MoodControls = () => {
  return (
    <ExpansionPanel>
      <ExpansionPanelSummary>
        <Typography variant='h6'>Mood</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <Typography>TODO: Mood controls.</Typography>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  )
}

export default MoodControls;
