import { Accordion, AccordionSummary, Button, Collapse, Grid, Typography } from '@mui/material';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { ControlsProps } from '.';
import { CeiledState } from '../api';
import { Animation } from '../api/patterns';
import AnimationComposer from '../components/animations/AnimationComposer';
import SpeedSlider from '../components/animations/SpeedSlider';
import useAnimations from '../hooks/animations/useAnimations';
import useCeiledAPI from '../hooks/api/useCeiledAPI';
import { AnimationsProvider } from '../hooks/context/AnimationsContext';
import { minWidth } from '../styles/theme';

const AnimationControls = (props: ControlsProps): JSX.Element => {
  const [syncCount] = useSyncCount();
  const [expanded, setExpanded] = useState(props.expanded);
  useEffect(() => setExpanded(props.expanded), [props.expanded]);

  return (
    <Accordion expanded={expanded} sx={{ minWidth: minWidth }}>
      <AnimationsProvider>
        <AccordionSummary onClick={() => setExpanded(!expanded)}>
          <Grid container justifyContent='space-between'>
            <Typography variant='h6'>Animations</Typography>
            <Grid item container xs={4} justifyContent='flex-end' spacing={2}>
              <Grid item>
                <SendButton disabled={!expanded} />
              </Grid>
              <Grid item>
                <SyncButton disabled={!expanded} />
              </Grid>
            </Grid>
          </Grid>
        </AccordionSummary>
        <SpeedSlider sx={{ padding: '0px 24px 8px 24px' }} />
        <Collapse in={expanded}>
          <AnimationComposer key={`animation-composer-${syncCount}`} />
        </Collapse>
      </AnimationsProvider>
    </Accordion>
  );
};

export default AnimationControls;

const SendButton = (props: { disabled?: boolean }) => {
  const [animations] = useAnimations();
  const [, api] = useCeiledAPI();

  const onSend = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.stopPropagation();
    api.setAnimations(encodeAnimations(animations));
  };

  return (
    <Button variant='outlined' onClick={onSend} disabled={props.disabled}>
      Send
    </Button>
  );
};

const SyncButton = (props: { disabled?: boolean }) => {
  const [ceiledState, api] = useCeiledAPI();
  const [, setAnimations] = useAnimations();
  const [syncCount, setSyncCount] = useSyncCount();

  const onSync = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.stopPropagation();
    api.getPattern('all');
    setAnimations(decodeCeiledState(ceiledState));
    setSyncCount(syncCount + 1);
  };

  return (
    <Button variant='outlined' onClick={onSync} disabled={props.disabled}>
      Sync
    </Button>
  );
};

const useSyncCount = (): [number, Dispatch<SetStateAction<number>>] => useState(0);

const decodeCeiledState = (state: CeiledState): Animation[] => {
  return Array.from(state.values()).map(patteranim => {
    if (Array.isArray(patteranim)) {
      return patteranim;
    }
    return [patteranim];
  });
};

const encodeAnimations = (animations: Animation[]): Map<number, Animation> => {
  return animations.reduce((map, anim, channel) => map.set(channel, anim), new Map<number, Animation>());
};
