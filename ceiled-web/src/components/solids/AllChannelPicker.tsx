import React from 'react';
import { GridList, GridListTile, makeStyles, Typography } from '@material-ui/core';
import ColorPicker from '../colorpicking/ColorPicker';
import { range } from '../animations/utils';
import { HSVColor } from '../colorpicking/colors';

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
  return (
    <GridList className={classes.gridList} spacing={8} cellHeight='auto' cols={3}>
      {range(3).map(channel => {
        const color = props.state.get(channel) || HSVColor.random();
        return (
          <GridListTile key={`solid-picker-${channel}`}>
            <Typography gutterBottom className={classes.channelLabel} align='center' variant='subtitle1'>
              Channel {channel + 1}
            </Typography>
            <ColorPicker
              preview
              className={classes.picker}
              hsv={color}
              onChange={c => props.onChange(new Map(props.state.set(channel, c)))}
            />
          </GridListTile>
        );
      })}
    </GridList>
  );
};
