import React, { CSSProperties, FunctionComponent } from 'react';
import { Draggable } from 'react-beautiful-dnd';

export interface DraggableDivProps {
  index: number;
  disabled?: boolean;
  style?: CSSProperties;
}

const DraggableDiv: FunctionComponent<DraggableDivProps> = props => {
  const id = `draggable-div-${props.index}`;
  return (
    <Draggable draggableId={id} index={props.index} isDragDisabled={props.disabled}>
      {provided => (
        <div style={props.style} ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
          {props.children}
        </div>
      )}
    </Draggable>
  );
};

export default DraggableDiv;
