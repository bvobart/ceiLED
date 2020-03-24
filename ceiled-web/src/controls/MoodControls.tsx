import React, { useState, useEffect } from 'react';
import { Typography, ExpansionPanel, ExpansionPanelSummary, makeStyles, Grid, Button } from '@material-ui/core';
import { ControlsProps } from '.';
import { Moods } from '../api/moods';
import SpeedSlider from '../components/animations/SpeedSlider';
import { MoodTile } from '../components/tiles/moods';

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
    width: '100%',
    minHeight: '104px',
    background: 'rgba(16, 16, 16, 0.3)'
  }
});

const MoodControls = (props: ControlsProps) => {
  const classes = useStyles();
  const [expanded, setExpanded] = useState(props.expanded);
  useEffect(() => setExpanded(props.expanded), [props.expanded]);

  const onClickMood = () => {
    // TODO: implement sending set mood request
    // TODO: implement client side function / hook to issue set mood request.
  }

  return (
    <ExpansionPanel className={classes.panel} expanded={expanded}>
      <ExpansionPanelSummary onClick={() => setExpanded(!expanded)}>
        <Grid container justify='space-between'>
          <Typography variant='h6'>Moods</Typography>
          <SyncButton disabled={!expanded} />
        </Grid>
      </ExpansionPanelSummary>
      <SpeedSlider className={classes.speed} />
      <Grid className={classes.tiles} container spacing={1}>
        { Object.values(Moods).map(mood => 
          <Grid key={'moodtile-' + mood} item xs={12} sm={6} md={4}>
            <MoodTile mood={mood}>
              <Button className={classes.button} variant='text' onClick={onClickMood}>{mood}</Button>
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
