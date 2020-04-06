import React, { useState, useEffect } from 'react';
import { Typography, ExpansionPanel, ExpansionPanelSummary, makeStyles, Grid, Button, Slide } from '@material-ui/core';
import { ControlsProps } from '.';
import { Moods } from '../api/moods';
import SpeedSlider from '../components/animations/SpeedSlider';
import { MoodTile } from '../components/tiles/moods';
import useCeiledAPI from '../hooks/api/useCeiledAPI';
import useCeiled from '../hooks/api/useCeiled';
import { CeiledStatus } from '../api';
import PowerButton from '../components/global/PowerButton';

const useStyles = makeStyles({
  panel: {
    minWidth: '400px',
  },
  speed: {
    padding: "0px 24px 8px 24px",
  },
  tiles: {
    padding: '8px',
  },
  button: {
    minHeight: '104px',
    background: 'rgba(16, 16, 16, 0.3)',
  },
  current: {
    minHeight: '104px',
    background: 'rgba(255, 255, 255, 0)',
  },
  power: {
    maxWidth: '48px',
  }
});

const MoodControls = (props: ControlsProps) => {
  const classes = useStyles();
  const [expanded, setExpanded] = useState(props.expanded);
  useEffect(() => setExpanded(props.expanded), [props.expanded]);
  const [showPowerButton, setShowPowerButton ] = useState(false);
  const [hidePowerButtonTimeout, setHidePBTimeout] = useState<NodeJS.Timeout | null>(null);
  
  const [status] = useCeiled();
  useEffect(() => {
    if (status === CeiledStatus.CONNECTED) {
      setShowPowerButton(false);
    } else if (status === CeiledStatus.TIMEOUT || status) {
      setTimeout(() => setShowPowerButton(false), 1500);
    }
  }, [status]);
  const [, api] = useCeiledAPI();
  const [currentMood, setCurrentMood] = useState<Moods | null>(null);

  const onClickMood = async (mood: Moods) => {
    try {
      await api.setMood(mood);
      setCurrentMood(mood);
    } catch (reason) {
      if (hidePowerButtonTimeout) {
        clearTimeout(hidePowerButtonTimeout);
      }
      setShowPowerButton(true);
      setHidePBTimeout(setTimeout(() => setShowPowerButton(false), 2000));
    }
  }

  const onClickPower = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.stopPropagation();
    if (hidePowerButtonTimeout) {
      clearTimeout(hidePowerButtonTimeout);
    }
    setHidePBTimeout(null);
  }

  return (
    <ExpansionPanel className={classes.panel} expanded={expanded}>
      <ExpansionPanelSummary onClick={() => setExpanded(!expanded)}>
        <Grid container justify='space-between'>
          <Typography variant='h6'>Moods</Typography>
          <Slide direction='down' in={showPowerButton} mountOnEnter unmountOnExit>
            <PowerButton className={classes.power} size='small' onClick={onClickPower} />
          </Slide>
          <SyncButton disabled={!expanded || status !== CeiledStatus.CONNECTED} />
        </Grid>
      </ExpansionPanelSummary>
      <SpeedSlider className={classes.speed} />
      <Grid className={classes.tiles} container spacing={1}>
        { Object.values(Moods).map(mood => 
          <Grid key={'moodtile-' + mood} item xs={12} sm={6} md={4}>
            <MoodTile mood={mood}>
              <Button 
                fullWidth variant='text' 
                className={mood === currentMood ? classes.current : classes.button} 
                onClick={() => onClickMood(mood)}
              >{mood}</Button>
            </MoodTile>
          </Grid>
        ) }
      </Grid>
    </ExpansionPanel>
  )
}

const SyncButton = (props: { disabled?: boolean }) => {
  const [syncCount, setSyncCount] = useState(0);

  const onSync = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.stopPropagation();
    setSyncCount(syncCount + 1);
  }

  // TODO: actually sync something here
  
  return <Button variant='outlined' onClick={onSync} disabled={props.disabled}>Sync</Button>
}

export default MoodControls;
