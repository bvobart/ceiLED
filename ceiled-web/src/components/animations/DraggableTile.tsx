import React, { FunctionComponent } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { ListItem } from '@material-ui/core';
import Tile, { TileProps } from '../color-picking/Tile';

export interface DraggableTileProps extends TileProps {
  index: number;
}

const DraggableTile: FunctionComponent<DraggableTileProps> = (props) => {
  const id = `draggable-tile-${props.index}`;
  return (
    <Draggable draggableId={id} index={props.index} key={id}>
      {provided => (
        <ListItem dense disableGutters 
          ref={provided.innerRef} 
          {...provided.draggableProps} 
          {...provided.dragHandleProps}
        >
          <Tile {...props} />
        </ListItem>
      )}
    </Draggable>
  )
}

export default DraggableTile;
