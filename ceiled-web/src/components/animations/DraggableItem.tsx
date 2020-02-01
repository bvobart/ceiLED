import React, { FunctionComponent } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { ListItem } from '@material-ui/core';

export interface DraggableItemProps {
  index: number;
  disabled?: boolean;
}

const DraggableItem: FunctionComponent<DraggableItemProps> = (props) => {
  const id = `draggable-item-${props.index}`;
  return (
    <Draggable draggableId={id} index={props.index} isDragDisabled={props.disabled}>
      {provided => (
        <ListItem dense disableGutters
          ref={provided.innerRef} 
          {...provided.draggableProps} 
          {...provided.dragHandleProps}
        >
          {props.children}
        </ListItem>
      )}
    </Draggable>
  )
}

export default DraggableItem;