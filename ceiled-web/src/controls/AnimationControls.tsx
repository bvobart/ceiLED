import React, { useState } from 'react';
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
  const [animations, setAnimations] = useAnimations();
  const [expanded, setExpanded] = useState(false);

  const onSend = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.stopPropagation();
    api.setAnimations(encodeAnimations(animations));
  }

  const onSync = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.stopPropagation();
    api.getPattern('all');
    setAnimations(decodeCeiledState(ceiledState));
    setSyncCount(syncCount + 1);
  }

  return (
    <ExpansionPanel expanded={expanded} className={classes.panel}>
      <ExpansionPanelSummary onClick={() => setExpanded(!expanded)}>
        <Grid container justify='space-between'>
          <Typography variant='h6'>Animations</Typography>
          <Button variant='outlined' onClick={onSend} disabled={!expanded}>Send</Button>
          <Button variant='outlined' onClick={onSync} disabled={!expanded}>Sync</Button>
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

const encodeAnimations = (animations: Animation[]): Map<number, Animation> => {
  return animations.reduce((map, anim, channel) => map.set(channel, anim), new Map<number, Animation>());
}
