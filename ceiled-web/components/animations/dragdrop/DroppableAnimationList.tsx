import React, { CSSProperties, FunctionComponent } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import AnimationList, { AnimationListProps } from '../AnimationList';

export interface DroppableAnimationListProps extends AnimationListProps {
  droppableId: string;
  style?: CSSProperties;
}

const DroppableAnimationList: FunctionComponent<DroppableAnimationListProps> = props => {
  return (
    <Droppable droppableId={props.droppableId}>
      {provided => (
        <div ref={provided.innerRef} {...provided.droppableProps}>
          <AnimationList {...props}>{provided.placeholder}</AnimationList>
        </div>
      )}
    </Droppable>
  );
};

export default DroppableAnimationList;
