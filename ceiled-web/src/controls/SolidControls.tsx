import React from 'react';
import { ExpansionPanel, ExpansionPanelSummary, Grid, Typography, makeStyles } from '@material-ui/core';
import ColorPicker from '../components/color-picking/ColorPicker';

const useStyles = makeStyles({
  panel: {
    minWidth: '400px',
  },
  content: {
    padding: '0px 8px 8px 8px',
  },
  picker: {
    minHeight: '276px',
  },
  channelLabel: {
    width: '100%'
  },
});

const SolidControls = () => {
  const classes = useStyles();

  return (
    <ExpansionPanel className={classes.panel}>
      <ExpansionPanelSummary>
        <Typography variant='h6'>Solids</Typography>
      </ExpansionPanelSummary>
      <div className={classes.content}>
        <Grid container spacing={1}>
          <Grid item xs={12} sm={4}>
            <Typography className={classes.channelLabel} align='center' variant='subtitle1'>Channel 1</Typography>
            <ColorPicker className={classes.picker} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography className={classes.channelLabel} align='center' variant='subtitle1'>Channel 2</Typography>
            <ColorPicker className={classes.picker} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography className={classes.channelLabel} align='center' variant='subtitle1'>Channel 3</Typography>
            <ColorPicker className={classes.picker} />
          </Grid>
        </Grid>
      </div>
    </ExpansionPanel>
  )
}

export default SolidControls;
