import { Button, List } from '@mui/material';
import React, { CSSProperties, FunctionComponent, useState } from 'react';
import { Animation, Pattern } from '../../api/patterns';
import { EditablePatternTile } from '../tiles/patterns';
import DraggableItem from './dragdrop/DraggableItem';
import EditPattern from './EditPattern';
import { remove, replace } from './utils';

export interface AnimationListProps {
  className?: string;
  channel?: number;
  animation: Animation;
  onChange: (anim: Animation) => void;
  style?: CSSProperties;
}

const AnimationList: FunctionComponent<AnimationListProps> = props => {
  const { animation, onChange } = props;
  const [adding, setAdding] = useState<boolean>(false);

  const onAddPattern = (pattern: Pattern | undefined) => {
    if (pattern) onChange([...animation, pattern]);
    setAdding(false);
  };

  const onEditPattern = (index: number, pattern: Pattern) => {
    onChange(replace(animation, index, pattern));
  };

  const onDeletePattern = (index: number) => {
    // TODO: transition out the deleted pattern?
    const [newAnim] = remove(animation, index);
    onChange(newAnim);
  };

  return (
    <div className={props.className} key={`animation-list-${props.channel}`} style={props.style}>
      <List disablePadding>
        {animation.map((pattern: Pattern, index: number) => {
          const key = `li-${props.channel}-${index}`;
          const draggableIndex = ((props.channel || 0) + 1) * 1000 + index;
          return (
            <AnimationItem
              key={key}
              draggableIndex={draggableIndex}
              pattern={pattern}
              onEditConfirm={newPattern => onEditPattern(index, newPattern)}
              onDelete={() => onDeletePattern(index)}
            />
          );
        })}
        {props.children}
      </List>
      {adding ? (
        <EditPattern onConfirm={onAddPattern} />
      ) : (
        <Button
          variant='outlined'
          onClick={() => setAdding(true)}
          sx={{ width: '100%', marginTop: '4px', minHeight: '48px' }}
        >
          Add
        </Button>
      )}
    </div>
  );
};

export default AnimationList;

interface AnimationItemProps {
  pattern: Pattern;
  draggableIndex: number;
  onEditConfirm: (pattern: Pattern) => void;
  onDelete: () => void;
}

const AnimationItem: FunctionComponent<AnimationItemProps> = props => {
  const { pattern, draggableIndex, onEditConfirm, onDelete } = props;
  const [dragDisabled, setDragDisabled] = useState(false);

  const onEditStart = () => setDragDisabled(true);
  const onEditFinish = (pattern: Pattern) => {
    setDragDisabled(false);
    onEditConfirm(pattern);
  };

  return (
    <DraggableItem index={draggableIndex} disabled={dragDisabled}>
      <EditablePatternTile
        pattern={pattern}
        onEditStart={onEditStart}
        onEditConfirm={onEditFinish}
        onDelete={onDelete}
      />
    </DraggableItem>
  );
};
