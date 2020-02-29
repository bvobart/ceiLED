import React, { useState, Dispatch, SetStateAction } from 'react';
import { makeStyles, ExpansionPanel, ExpansionPanelSummary, Typography, Grid, Button } from '@material-ui/core';
import AnimationComposer from '../components/animations/AnimationComposer';
import { CeiledState } from '../api';
import { Animation } from '../api/patterns';
import useAnimations from '../hooks/animations/useAnimations';
import useCeiledAPI from '../hooks/useCeiledAPI';
import { AnimationsProvider } from '../hooks/animations/AnimationsContext';

const useStyles = makeStyles({
  panel: {
    minWidth: '400px',
  },
});

const AnimationControls = () => {
  const classes = useStyles();
  const [syncCount] = useSyncCount();
  const [expanded, setExpanded] = useState(false);

  return (
    <ExpansionPanel expanded={expanded} className={classes.panel}>
      <AnimationsProvider>
        <ExpansionPanelSummary onClick={() => setExpanded(!expanded)}>
          <Grid container justify='space-between'>
            <Typography variant='h6'>Animations</Typography>
            <SendButton disabled={!expanded} />
            <SyncButton disabled={!expanded} />
          </Grid>
        </ExpansionPanelSummary>

        <AnimationComposer key={`animation-composer-${syncCount}`} />
      </AnimationsProvider>
    </ExpansionPanel>
  )
}

export default AnimationControls;

const SendButton = (props: { disabled?: boolean }) => {
  const [animations] = useAnimations();
  const [, api] = useCeiledAPI();

  const onSend = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.stopPropagation();
    api.setAnimations(encodeAnimations(animations));
  };
  
  return <Button variant='outlined' onClick={onSend} disabled={props.disabled}>Send</Button>
}

const SyncButton = (props: { disabled?: boolean }) => {
  const [ceiledState, api] = useCeiledAPI();
  const [, setAnimations] = useAnimations();
  const [syncCount, setSyncCount] = useSyncCount();

  const onSync = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.stopPropagation();
    api.getPattern('all');
    setAnimations(decodeCeiledState(ceiledState));
    setSyncCount(syncCount + 1);
  }
  
  return <Button variant='outlined' onClick={onSync} disabled={props.disabled}>Sync</Button>
}

const useSyncCount = (): [number, Dispatch<SetStateAction<number>>] => useState(0);

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
