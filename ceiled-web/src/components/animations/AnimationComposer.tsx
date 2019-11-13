import React, { useState } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { makeStyles, Grid, Typography, Divider } from '@material-ui/core';
import { Animation } from '.';
import { replace, swap, range, remove, insert } from './utils';
import DroppableAnimationList from './DroppableAnimationList';

const numChannels = 3;

const useStyles = makeStyles({
  content: {
    padding: '0px 8px 8px 8px',
  },
  animator: {
    width: '100%',
  },
  label: {
    width: '100%',
  },
  tile: {
    minHeight: '48px',
  },
});

const AnimationComposer = () => {
  const classes = useStyles();
  const [animations, setAnimations] = useState<Animation[]>(range(numChannels).map(() => []));

  const onDragEnd = (result: DropResult) => {
    // element was dropped outside of droppables
    if (!result.destination) return;
    // element was dragged, but dropped in its original spot
    if (result.destination.index === result.source.index) return;
    
    // element was dragged and dropped into the same column
    if (result.source.droppableId === result.destination.droppableId) {
      const channel = parseInt(result.source.droppableId.charAt(8));
      const sourceIndex = result.source.index - (channel + 1) * 1000;
      const destIndex = result.destination.index - (channel + 1) * 1000;
      // swap the elements' places in the animation list
      const animation = swap(animations[channel], sourceIndex, destIndex);
      setAnimations(replace(animations, channel, animation));
    } else {
      // otherwise element was dragged and dropped into another column
      const fromChannel = parseInt(result.source.droppableId.charAt(8));
      const toChannel = parseInt(result.destination.droppableId.charAt(8));
      const sourceIndex = result.source.index - (fromChannel + 1) * 1000;
      const destIndex = result.destination.index - (toChannel + 1) * 1000;
      // remove the element from the source animation list and add it to the destination animation list
      const [fromAnimation, item] = remove(animations[fromChannel], sourceIndex);
      const toAnimation = insert(animations[toChannel], destIndex, item);
      const newAnimations = replace(replace(animations, fromChannel, fromAnimation), toChannel, toAnimation);
      setAnimations(newAnimations);
    }
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Grid className={classes.content} container spacing={1}>
        {range(numChannels).map((channel) => (
          <Grid item key={channel} xs={4}>
            <Typography gutterBottom className={classes.label} align='center' variant='subtitle1'>Channel {channel + 1}</Typography>
            <Divider />
            <DroppableAnimationList
              animation={animations[channel]}
              channel={channel}
              className={classes.animator}
              droppableId={`channel-${channel}`} 
              onChange={anim => setAnimations(replace(animations, channel, anim))}
            />
          </Grid>
        ))}
      </Grid>
    </DragDropContext>
  )
}

export default AnimationComposer;
