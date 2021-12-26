import { Grid, makeStyles, Typography } from '@material-ui/core';
import React, { useCallback, useState } from 'react';
import { HSVColor } from '../../api/colors';
import { range } from '../animations/utils';
import ColorPicker from '../colorpicking/ColorPicker';

const useStyles = makeStyles({
  picker: {
    minHeight: '276px',
  },
  channelLabel: {
    width: '100%',
  },
  gridList: {
    flexWrap: 'nowrap',
    transform: 'translateZ(0)',
  },
});

export interface AllChannelPickerProps {
  state: Map<number, HSVColor>;
  onChange: (newState: Map<number, HSVColor>) => void;
}

export const AllChannelPicker = (props: AllChannelPickerProps) => {
  const classes = useStyles();
  const { state, onChange: onChangeProp } = props;
  const [clickCount, setClickCount] = useState(0);

  const onChange = useCallback(
    (newState: Map<number, HSVColor>) => {
      onChangeProp(newState);
    },
    [onChangeProp],
  );

  /**
   * On double clicking the header for a specific channel,
   * set the picked colour of that channel on all channels
   */
  const onDoubleClickHeader = (channel: number) => {
    const color = state.get(channel);
    if (!color) return;

    for (const i of range(3)) {
      state.set(i, color);
    }

    onChange(new Map(state));
    setClickCount(clickCount + 1); // refresh other pickers
  };

  return (
    <Grid container justifyContent='space-between' alignItems='center' spacing={1}>
      {range(3).map(channel => {
        const color = state.get(channel) || HSVColor.random();
        return (
          <Grid item xs={4} key={`solid-picker-${channel}-${clickCount}`}>
            <div onDoubleClick={() => onDoubleClickHeader(channel)}>
              <Typography gutterBottom className={classes.channelLabel} align='center' variant='subtitle1'>
                Channel {channel + 1}
              </Typography>
            </div>
            <ColorPicker
              preview
              className={classes.picker}
              hsv={color}
              onChange={c => onChange(new Map(state.set(channel, c)))}
            />
          </Grid>
        );
      })}
    </Grid>
  );
};
