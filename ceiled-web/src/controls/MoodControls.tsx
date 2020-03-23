import React from 'react';
import { Typography, ExpansionPanel, ExpansionPanelSummary, makeStyles, Grid, Button } from '@material-ui/core';
import SpeedSlider from '../components/animations/SpeedSlider';
import { Moods } from '../api/moods';
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

const MoodControls = () => {
  const classes = useStyles();

  const onClickMood = () => {
    // TODO: implement sending set mood request
    // TODO: implement client side function / hook to issue set mood request.
  }

  return (
    <ExpansionPanel className={classes.panel}>
      <ExpansionPanelSummary>
        <Typography variant='h6'>Mood</Typography>
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

export default MoodControls;
