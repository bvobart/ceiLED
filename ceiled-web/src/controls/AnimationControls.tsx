import React, { useState, useCallback } from 'react';
import { makeStyles, ExpansionPanel, ExpansionPanelSummary, Typography, Grid, Button } from '@material-ui/core';
import AnimationComposer, { useAnimations } from '../components/animations/AnimationComposer';
import useCeiledAPI from '../hooks/useCeiledAPI';
import { CeiledState } from '../api';
import { Animation } from '../api/patterns';

const useStyles = makeStyles({
  panel: {
    minWidth: '400px',
  },
});

const AnimationControls = () => {
  const classes = useStyles();
  const [ceiledState, api] = useCeiledAPI();
  const [syncCount, setSyncCount] = useState(0);
  const [, setAnimations] = useAnimations();

  const onSync = useCallback((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.stopPropagation();
    api.getPattern('all');
    setAnimations(decodeCeiledState(ceiledState));
    setSyncCount(syncCount + 1);
  }, [ceiledState, api, setAnimations, syncCount, setSyncCount]);

  return (
    <ExpansionPanel className={classes.panel}>
      <ExpansionPanelSummary>
        <Grid container justify='space-between'>
          <Typography variant='h6'>Animations</Typography>
          <Grid item><Button variant='outlined' onClick={onSync}>Sync</Button></Grid>
        </Grid>
      </ExpansionPanelSummary>

      <AnimationComposer key={`animation-composer-${syncCount}`} />
    </ExpansionPanel>
  )
}

export default AnimationControls;

const decodeCeiledState = (state: CeiledState): Animation[] => {
  return Array.from(state.values()).map(patteranim => {
    if (Array.isArray(patteranim)) {
      return patteranim;
    }
    return [patteranim];
  });
}
