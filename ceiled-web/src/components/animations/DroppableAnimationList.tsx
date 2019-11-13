import React, { FunctionComponent } from "react"
import AnimationList, { AnimationListProps } from "./AnimationList"
import { Droppable } from "react-beautiful-dnd"

export interface DroppableAnimationListProps extends AnimationListProps {
  droppableId: string;
}

const DroppableAnimationList: FunctionComponent<DroppableAnimationListProps> = (props) => {
  return (
    <Droppable droppableId={props.droppableId}>
      { provided => (
        <div ref={provided.innerRef} {...provided.droppableProps}>
          <AnimationList {...props}>
            {provided.placeholder}
          </AnimationList>
        </div>
      )}
    </Droppable>
  )
}

export default DroppableAnimationList;
