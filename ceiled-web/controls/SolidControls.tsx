import { Accordion, AccordionSummary, Button, Grid, Theme, Typography, useMediaQuery } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { ControlsProps } from '.';
import { CeiledState } from '../api';
import { HSVColor } from '../api/colors';
import { Pattern, SolidPattern } from '../api/patterns';
import { AllChannelPicker } from '../components/solids/AllChannelPicker';
import { PerChannelPicker } from '../components/solids/PerChannelPicker';
import { isBrowser } from '../config';
import useCeiledAPI from '../hooks/api/useCeiledAPI';
import { minWidth } from '../styles/theme';

const key = 'solids-state';

export type SolidsState = Map<number, HSVColor>;

/**
 * Controls for solid colours. The chosen colours are saved in localStorage so that they persist on reload.
 * When the component renders, it first checks whether there are any colours in localStorage. If not, then
 * random colours are chosen. The 'Sync' button synchronises the displayed colours with those that are
 * currently actually being displayed on the server.
 */
const SolidControls = (props: ControlsProps): JSX.Element => {
  const [ceiledState, api] = useCeiledAPI();
  const [solidsState, setSolidsState] = useSolidsState();
  const [expanded, setExpanded] = useState(props.expanded);
  useEffect(() => setExpanded(props.expanded), [props.expanded]);

  const showAllChannels = useMediaQuery<Theme>(theme => theme.breakpoints.up('md'));

  const onChangeSolidsState = useCallback(
    (newState: SolidsState) => {
      setSolidsState(newState);
      api.setPatterns(encodeAsPatterns(newState));
    },
    [api, setSolidsState],
  );

  const onSync = useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      event.stopPropagation();
      api.getPattern('all');
      setSolidsState(decodeCeiledState(ceiledState));
    },
    [ceiledState, api, setSolidsState],
  );

  return (
    <Accordion expanded={expanded} sx={{ minWidth }}>
      <AccordionSummary onClick={() => setExpanded(!expanded)}>
        <Grid container justifyContent='space-between'>
          <Grid item>
            <Typography variant='h6'>Solids</Typography>
          </Grid>
          <Grid item>
            <Button variant='outlined' onClick={onSync} disabled={!expanded}>
              Sync
            </Button>
          </Grid>
        </Grid>
      </AccordionSummary>
      <div style={{ padding: '0px 8px 8px 8px', userSelect: 'none' }}>
        {showAllChannels ? (
          <AllChannelPicker state={solidsState} onChange={onChangeSolidsState} />
        ) : (
          <PerChannelPicker state={solidsState} onChange={onChangeSolidsState} />
        )}
      </div>
    </Accordion>
  );
};

export default SolidControls;

const useSolidsState = (): [SolidsState, (state: SolidsState) => void] => {
  const savedState = isBrowser() ? localStorage.getItem(key) || '[]' : '[]';
  const [state, setState] = useState(decodeSavedState(savedState));

  const updateState = useCallback(
    (state: SolidsState): void => {
      localStorage.setItem(key, encodeSavedState(state));
      setState(state);
    },
    [setState],
  );

  return [state, updateState];
};

const encodeSavedState = (state: SolidsState): string => {
  return JSON.stringify(Array.from(state.entries()));
};

const decodeSavedState = (state: string): SolidsState => {
  const saved = new Map<number, any>(JSON.parse(state));
  const res = new Map<number, HSVColor>();
  for (const [key, value] of saved.entries()) {
    if (HSVColor.is(value)) {
      res.set(key, new HSVColor(value));
    }
  }
  return res;
};

const decodeCeiledState = (state: CeiledState): SolidsState => {
  const res = new Map<number, HSVColor>();
  for (const [channel, pattern] of state.entries()) {
    if (SolidPattern.is(pattern)) {
      res.set(channel, pattern.color.toHSV());
    }
  }
  return res;
};

const encodeAsPatterns = (state: SolidsState): Map<number, Pattern> => {
  const res = new Map<number, Pattern>();
  for (const [channel, color] of state.entries()) {
    res.set(channel, new SolidPattern(1, color.toRGB()));
  }
  return res;
};
