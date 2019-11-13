import React from 'react';
import { makeStyles, ExpansionPanel, ExpansionPanelSummary, Typography } from '@material-ui/core';
import AnimationComposer from '../components/animations/AnimationComposer';

const useStyles = makeStyles({
  panel: {
    minWidth: '400px',
  },
});

const AnimationControls = () => {
  const classes = useStyles();

  return (
    <ExpansionPanel className={classes.panel}>
      <ExpansionPanelSummary>
        <Typography variant='h6'>Animations</Typography>
      </ExpansionPanelSummary>

      <AnimationComposer />
    </ExpansionPanel>
  )
}

export default AnimationControls;
