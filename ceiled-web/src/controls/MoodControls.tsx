import React from 'react';
import { Typography, ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary, makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  panel: {
    minWidth: '400px',
  },
});

/**
 * Ideas for moods to be developed:
 * - Productive: primarily light blue, some greenish and purpleish tones to keep you awake.
 * - Cool: primarily blue, some purple / pink tones
 * - Colourful: red, green and blue mixed
 * - Calm: primarily roomlight, but with nuanced warm colour accents
 * - Warm: primarily orange (bit warmer than roomlight) with some red and yellow tones
 * - Loving: primarily deep red with a bit of purple / pink
 */

const MoodControls = () => {
  const classes = useStyles();
  return (
    <ExpansionPanel className={classes.panel}>
      <ExpansionPanelSummary>
        <Typography variant='h6'>Mood</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <Typography>TODO: Mood controls.</Typography>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  )
}

export default MoodControls;
