import React from 'react';
import { ExpansionPanel, ExpansionPanelSummary, Grid, Typography, makeStyles } from '@material-ui/core';
import ColorPicker from '../components/color-picking/ColorPicker';
import { HSVColor } from '../components/color-picking/colors';

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
  const hsv = new HSVColor({ h: 0, s: .75, v: 1});
  // TODO: get from server or localstorage.

  const onChangeColor = (channel: number, newColor: HSVColor) => {
    console.log(`Channel ${channel}: Setting colour: ${newColor.toCSS()}`);
  }

  return (
    <ExpansionPanel className={classes.panel}>
      <ExpansionPanelSummary>
        <Typography variant='h6'>Solids</Typography>
      </ExpansionPanelSummary>
      <div className={classes.content}>
        <Grid container spacing={1}>
          <Grid item xs={12} sm={4}>
            <Typography gutterBottom className={classes.channelLabel} align='center' variant='subtitle1'>Channel 1</Typography>
            <ColorPicker preview className={classes.picker} hsv={hsv} onChange={(c) => onChangeColor(0, c)} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography gutterBottom className={classes.channelLabel} align='center' variant='subtitle1'>Channel 2</Typography>
            <ColorPicker preview className={classes.picker} hsv={hsv} onChange={(c) => onChangeColor(1, c)} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography gutterBottom className={classes.channelLabel} align='center' variant='subtitle1'>Channel 3</Typography>
            <ColorPicker preview className={classes.picker} hsv={hsv} onChange={(c) => onChangeColor(2, c)} />
          </Grid>
        </Grid>
      </div>
    </ExpansionPanel>
  )
}

export default SolidControls;
