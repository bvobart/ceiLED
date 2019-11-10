import React from 'react';
import { ExpansionPanel, makeStyles, ExpansionPanelSummary, Typography, Grid } from '@material-ui/core';
import ChannelAnimator from '../components/animations/ChannelAnimator';

const useStyles = makeStyles({
  panel: {
    minWidth: '400px',
  },
  content: {
    padding: '0px 8px 8px 8px',
  },
  animator: {
    width: '100%',
  },
});

const AnimationControls = () => {
  const classes = useStyles();
  return (
    <ExpansionPanel className={classes.panel}>
      <ExpansionPanelSummary>
        <Typography variant='h6'>Animations</Typography>
      </ExpansionPanelSummary>
      <Grid className={classes.content} container spacing={1}>
        <Grid item xs={12} sm={4}>
          <ChannelAnimator className={classes.animator} channel={0} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <ChannelAnimator className={classes.animator} channel={1} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <ChannelAnimator className={classes.animator} channel={2} />
        </Grid>
      </Grid>
    </ExpansionPanel>
  )
}

export default AnimationControls;
