import React from 'react';
import { ExpansionPanel, ExpansionPanelSummary, Typography, ExpansionPanelDetails, makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  panel: {
    minWidth: '400px',
  },
});

const SolidControls = () => {
  const classes = useStyles();
  return (
    <ExpansionPanel className={classes.panel}>
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
