import { MenuItem, Select } from '@mui/material';
import throttle from 'lodash.throttle';
import React, { useState } from 'react';
import { HSVColor } from '../../api/colors';
import { SolidsState } from '../../controls/SolidControls';
import { range } from '../animations/utils';
import ColorPicker from '../colorpicking/ColorPicker';

export interface PerChannelPickerProps {
  state: SolidsState;
  onChange: (state: SolidsState) => void;
}

const channelOptions = ['All Channels', ...range(3).map(ch => `Channel ${ch + 1}`)];

export const PerChannelPicker = (props: PerChannelPickerProps) => {
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
        sx={{ width: '100%', textAlign: 'center' }}
      >
        {channelOptions.map((label, index) => (
          <MenuItem key={`PerChannelPicker-${index}`} value={index}>
            {label}
          </MenuItem>
        ))}
      </Select>

      <ColorPicker
        preview
        hsv={selectedColor}
        onChange={handleChange}
        style={{ minHeight: '276px', marginTop: '8px' }}
      />
    </>
  );
};
