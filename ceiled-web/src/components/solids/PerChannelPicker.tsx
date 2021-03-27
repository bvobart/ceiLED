import React, { useState } from 'react';
import { makeStyles, MenuItem, Select } from '@material-ui/core';
import { range } from '../animations/utils';
import ColorPicker from '../colorpicking/ColorPicker';
import { HSVColor } from '../colorpicking/colors';
import { SolidsState } from '../../controls/SolidControls';
import throttle from 'lodash.throttle';

const useStyles = makeStyles({
  select: {
    width: '100%',
    textAlign: 'center',
  },
  channelLabel: {
    width: '100%',
  },
  picker: {
    minHeight: '276px',
  },
});

export interface PerChannelPickerProps {
  state: SolidsState;
  onChange: (state: SolidsState) => void;
}

const channelOptions = ['All Channels', ...range(3).map(ch => `Channel ${ch + 1}`)];

export const PerChannelPicker = (props: PerChannelPickerProps) => {
  const classes = useStyles();
  const [selectedChannel, setSelectedChannel] = useState(0); // index on channelOptions

  const ceiledChannel = selectedChannel - 1;
  const selectedColor = props.state.get(ceiledChannel) || HSVColor.random();
  const handleChange = throttle((c: HSVColor) => props.onChange(new Map(props.state.set(ceiledChannel, c))), 100);

  return (
    <>
      <Select
        id='select-solid-channel'
        value={selectedChannel}
        onChange={event => setSelectedChannel(event.target.value as number)}
        className={classes.select}
      >
        {channelOptions.map((label, index) => (
          <MenuItem key={`PerChannelPicker-${index}`} value={index}>
            {label}
          </MenuItem>
        ))}
      </Select>

      <ColorPicker preview className={classes.picker} hsv={selectedColor} onChange={handleChange} />
    </>
  );
};
