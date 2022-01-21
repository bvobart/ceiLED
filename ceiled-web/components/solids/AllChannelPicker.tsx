import { Grid, Typography } from '@mui/material';
import React, { useCallback, useState } from 'react';
import { HSVColor } from '../../api/colors';
import { range } from '../animations/utils';
import ColorPicker from '../colorpicking/ColorPicker';

export interface AllChannelPickerProps {
  state: Map<number, HSVColor>;
  onChange: (newState: Map<number, HSVColor>) => void;
}

export const AllChannelPicker = (props: AllChannelPickerProps) => {
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
              <Typography gutterBottom align='center' variant='subtitle1' sx={{ width: '100%' }}>
                Channel {channel + 1}
              </Typography>
            </div>
            <ColorPicker
              preview
              hsv={color}
              onChange={c => onChange(new Map(state.set(channel, c)))}
              style={{ minHeight: '276px' }}
            />
          </Grid>
        );
      })}
    </Grid>
  );
};
