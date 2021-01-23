import React, { FunctionComponent } from 'react';
import { Draggable } from 'react-beautiful-dnd';

export interface DraggableDivProps {
  index: number;
  disabled?: boolean;
}

const DraggableDiv: FunctionComponent<DraggableDivProps> = props => {
  const id = `draggable-div-${props.index}`;
  return (
    <Draggable draggableId={id} index={props.index} isDragDisabled={props.disabled}>
      {provided => (
        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
          {props.children}
        </div>
      )}
    </Draggable>
  );
};

export default DraggableDiv;
