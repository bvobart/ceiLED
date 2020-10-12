import React from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { makeStyles, Typography, Divider, useTheme, useMediaQuery, GridList, GridListTile } from '@material-ui/core';
import { replace, reorder, range, remove, insert } from './utils';
import DroppableAnimationList from './dragdrop/DroppableAnimationList';
import useAnimations from '../../hooks/animations/useAnimations';

const numChannels = 3;

const useStyles = makeStyles({
  root: {
    padding: '0px 8px 8px 8px',
    userSelect: 'none',
    flexWrap: 'nowrap',
  },
  animator: {
    width: '100%',
    marginTop: '4px',
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
  const theme = useTheme();
  const isNotMobile = useMediaQuery(theme.breakpoints.up('sm'));
  const [animations, setAnimations] = useAnimations();

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
      const animation = reorder(animations[channel], sourceIndex, destIndex);
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
      <GridList className={classes.root} spacing={8} cellHeight='auto' cols={isNotMobile ? 3 : 1.5}>
        {range(numChannels).map((channel) => (
          <GridListTile key={channel}>
            <Typography gutterBottom className={classes.label} align='center' variant='subtitle1'>Channel {channel + 1}</Typography>
            <Divider />
            <DroppableAnimationList
              animation={animations[channel]}
              channel={channel}
              className={classes.animator}
              droppableId={`channel-${channel}`} 
              onChange={anim => setAnimations(replace(animations, channel, anim))}
            />
          </GridListTile>
        ))}
      </GridList>
    </DragDropContext>
  )
}

export default AnimationComposer;