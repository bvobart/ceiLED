import { MenuItem, Select } from '@mui/material';
import throttle from 'lodash.throttle';
import { useState } from 'react';
import { HSVColor } from '../../api/colors';
import { SolidsState } from '../../controls/SolidControls';
import { range } from '../animations/utils';
import ColorPicker from '../colorpicking/ColorPicker';

export interface PerChannelPickerProps {
  state: SolidsState;
  onChange: (state: SolidsState) => void;
}

const maxChannels = 3;
const channelOptions = ['All Channels', ...range(maxChannels).map(ch => `Channel ${ch + 1}`)];

export const PerChannelPicker = (props: PerChannelPickerProps) => {
  const { state, onChange } = props;
  const [selectedChannel, setSelectedChannel] = useState(0); // index on channelOptions
  const ceiledChannel = selectedChannel - 1;

  const selectedColor = state.get(ceiledChannel) || HSVColor.random();

  const handleChange = throttle((c: HSVColor) => {
    // -1 means all channels
    if (ceiledChannel === -1) {
      onChange(new Map(range(maxChannels).map(ch => [ch, c])));
    } else {
      onChange(new Map(state.set(ceiledChannel, c)));
    }
  }, 100);

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
