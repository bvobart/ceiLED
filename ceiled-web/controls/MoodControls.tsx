import { Accordion, AccordionSummary, Button, Grid, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { ControlsProps } from '.';
import { CeiledStatus } from '../api';
import { Moods } from '../api/moods';
import SpeedSlider from '../components/animations/SpeedSlider';
import { SlidingPowerButton } from '../components/global/SlidingPowerButton';
import { MoodTile } from '../components/tiles/moods';
import useCeiled from '../hooks/api/useCeiled';
import useCeiledAPI from '../hooks/api/useCeiledAPI';
import { minWidth } from '../styles/theme';

const unselectedStyles = {
  color: 'white',
  background: 'rgba(16, 16, 16, 0.3)',
};

const selectedStyles = {
  color: 'black',
  background: 'rgba(255, 255, 255, 0)',
};

const MoodControls = (props: ControlsProps): JSX.Element => {
  const [expanded, setExpanded] = useState(props.expanded);
  useEffect(() => setExpanded(props.expanded), [props.expanded]);
  const [showPowerButton, setShowPowerButton] = useState(false);

  const [status] = useCeiled();
  const [, api] = useCeiledAPI();
  const [currentMood, setCurrentMood] = useState<Moods | null>(null);

  const onClickMood = async (mood: Moods) => {
    try {
      await api.setMood(mood);
      setCurrentMood(mood);
    } catch (reason) {
      setShowPowerButton(true);
      setTimeout(() => setShowPowerButton(false), 3000);
    }
  };

  return (
    <Accordion expanded={expanded} sx={{ minWidth }}>
      <AccordionSummary onClick={() => setExpanded(!expanded)}>
        <Grid container justifyContent='space-between'>
          <Typography variant='h6'>Moods</Typography>
          <SlidingPowerButton
            in={showPowerButton}
            size='small'
            onClick={event => event.stopPropagation()}
            sx={{ maxWidth: '48px' }}
          />
          <SyncButton disabled={!expanded || status !== CeiledStatus.CONNECTED} />
        </Grid>
      </AccordionSummary>
      <SpeedSlider sx={{ padding: '0px 24px 8px 24px' }} />
      <Grid container spacing={1} sx={{ padding: '8px' }}>
        {Object.values(Moods).map(mood => (
          <Grid key={'moodtile-' + mood} item xs={12} sm={6} md={4}>
            <MoodTile mood={mood}>
              <Button
                fullWidth
                variant='text'
                onClick={() => onClickMood(mood)}
                sx={{
                  height: '104px',
                  borderRadius: '4px',
                  ...(mood === currentMood ? selectedStyles : unselectedStyles),
                }}
              >
                {mood}
              </Button>
            </MoodTile>
          </Grid>
        ))}
      </Grid>
    </Accordion>
  );
};

const SyncButton = (props: { disabled?: boolean }) => {
  const [syncCount, setSyncCount] = useState(0);

  const onSync = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.stopPropagation();
    setSyncCount(syncCount + 1);
  };

  // TODO: actually sync something here

  return (
    <Button variant='outlined' onClick={onSync} disabled={props.disabled}>
      Sync
    </Button>
  );
};

export default MoodControls;
