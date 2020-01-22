import React, { useState, useCallback } from 'react';
import { ExpansionPanel, ExpansionPanelSummary, Grid, Typography, makeStyles, Button } from '@material-ui/core';
import { CeiledState } from '../api';
import { SolidPattern } from '../api/patterns';
import ColorPicker from '../components/color-picking/ColorPicker';
import { HSVColor } from '../components/color-picking/colors';
import useCeiledAPI from '../hooks/useCeiledAPI';
import { range } from '../components/animations/utils';

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

const key = 'solids-state';

/**
 * Controls for solid colours. The chosen colours are saved in localStorage so that they persist on reload.
 * When the component renders, it first checks whether there are any colours in localStorage. If not, then
 * random colours are chosen. The 'Sync' button synchronises the displayed colours with those that are
 * currently actually being displayed on the server.
 */
const SolidControls = () => {
  const classes = useStyles();
  const [ceiledState, api] = useCeiledAPI();
  const [solidsState, setSolidsState] = useSolidsState();
  const [syncCount, setSyncCount] = useState(0);

  const onChangeColor = useCallback((channel: number, newColor: HSVColor) => {
    setSolidsState(new Map(solidsState.set(channel, newColor)));
    api.setPattern(channel, new SolidPattern(1, newColor.toRGB()));
  }, [solidsState, api, setSolidsState]);

  const onSync = useCallback((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.stopPropagation();
    api.getPattern('all');
    setSolidsState(decodeCeiledState(ceiledState));
    setSyncCount(syncCount + 1);
  }, [ceiledState, api, syncCount, setSolidsState, setSyncCount]);

  return (
    <ExpansionPanel className={classes.panel}>
      <ExpansionPanelSummary>
        <Grid container justify='space-between'>
          <Grid item><Typography variant='h6'>Solids</Typography></Grid>
          <Grid item><Button variant='outlined' onClick={onSync}>Sync</Button></Grid>
        </Grid>
      </ExpansionPanelSummary>
      <div className={classes.content}>
        <Grid container spacing={1}>
          {range(3).map(channel => {
            const color = solidsState.get(channel) || HSVColor.random();
            return (
              <Grid item xs={12} sm={4} key={`solid-picker-${channel}-${syncCount}`}>
                <Typography gutterBottom className={classes.channelLabel} align='center' variant='subtitle1'>Channel {channel + 1}</Typography>
                <ColorPicker preview className={classes.picker} hsv={color} onChange={(c) => onChangeColor(channel, c)} />
              </Grid>
            );
          })}
        </Grid>
      </div>
    </ExpansionPanel>
  )
}

export default SolidControls;

const useSolidsState = (): [Map<number, HSVColor>, (state: Map<number, HSVColor>) => void] => {
  const savedState = decodeSavedState(localStorage.getItem(key) || '[]');
  const [state, setState] = useState(savedState);

  const updateState = useCallback((state: Map<number, HSVColor>): void => {
    localStorage.setItem(key, encodeSavedState(state));
    setState(state);
  }, [setState]);

  return [state, updateState];
}

const encodeSavedState = (state: Map<number, HSVColor>): string => {
  return JSON.stringify(Array.from(state.entries()));
}

const decodeSavedState = (state: string): Map<number, HSVColor> => {
  const saved = new Map<number, any>(JSON.parse(state));
  const res = new Map<number, HSVColor>();
  for (const [key, value] of saved.entries()) {
    if (HSVColor.is(value)) {
      res.set(key, new HSVColor(value));
    }
  }
  return res;
}

const decodeCeiledState = (state: CeiledState): Map<number, HSVColor> => {
  const res = new Map<number, HSVColor>();
  for (const [channel, pattern] of state.entries()) {
    if (SolidPattern.is(pattern)) {
      res.set(channel, pattern.color.toHSV());
    }
  }
  return res;
}
