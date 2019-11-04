import React from 'react';
import { Typography, ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary, makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  panel: {
    minWidth: '400px',
  },
});

const MoodControls = () => {
  const classes = useStyles();
  return (
    <ExpansionPanel className={classes.panel}>
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
