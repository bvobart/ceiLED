import React, { useState, useCallback } from 'react';
import { Button, makeStyles } from '@material-ui/core';
import { FadePattern, PatternType } from '../../api/patterns';
import { HSVColor } from '../color-picking/colors';
import OutlinedBox from '../global/OutlinedBox';
import { EditableTile } from '../tiles';
import { replace, remove, reorder } from './utils';
import { DragDropContext, DropResult, Droppable } from 'react-beautiful-dnd';
import DraggableDiv from './dragdrop/DraggableDiv';

const useStyles = makeStyles({
  buttonConfirm: {
    width: '100%',
    marginTop: '8px',
    minHeight: '48px',
  },
  buttonAdd: {
    width: '100%',
    minHeight: '32px',
  },
  roundedTop: {
    borderRadius: '4px 4px 0px 0px',
  },
  roundedBottom: {
    borderRadius: '0px 0px 4px 4px'
  }
});

let droppableCount = 0;

export interface EditFadePatternProps {
  pattern?: FadePattern;
  onConfirm: (pattern: FadePattern) => void;
  type: PatternType.FADE_LINEAR | PatternType.FADE_SIGMOID;
}

const EditFadePattern = (props: EditFadePatternProps) => {
  const { pattern: initialPattern, onConfirm, type } = props;
  const classes = useStyles();
  const defaultColors = initialPattern ? initialPattern.colors.map(c => c.toHSV()) : [HSVColor.random()];
  const [colors, setColors] = useState<HSVColor[]>(defaultColors);

  const onClickAdd = () => {
    setColors([...colors, HSVColor.random()]);
  }

  const onClickConfirm = () => {
    const length = initialPattern ? initialPattern.length : colors.length;
    const rgbs = colors.map(c => c.toRGB());
    onConfirm(new FadePattern(type, length, rgbs));
  }

  const onDragEnd = (result: DropResult) => {
    // element was dropped outside of droppables
    if (!result.destination) return;
    // element was dragged, but dropped in its original spot
    if (result.destination.index === result.source.index) return;
    // element was dragged and dropped into the same column (there is only one column)
    if (result.source.droppableId === result.destination.droppableId) {
      const newColors = reorder(colors, result.source.index, result.destination.index);
      setColors(newColors);
    }
  }

  /**
   * ColorTiles is a sub-component that renders the list of draggable, editable color tiles.
   * Needs to be separate component, else the list won't rerender upon drag 'n drop.
   */
  const ColorTiles = useCallback(() => (
    <>{colors.map((color, index) => (
      <DraggableDiv index={index} key={`edittile-${index}`}>
        <EditableTile
          // make the first tile have rounded top and last tile have rounded bottom
          className={index === 0 ? classes.roundedTop : index === colors.length - 1 ? classes.roundedBottom : undefined} 
          hsv={color} 
          onEditConfirm={newColor => setColors(replace(colors, index, newColor))}
          onDelete={() => {
            const [cs] = remove(colors, index);
            setColors(cs);
          }}
        />
      </DraggableDiv>
    ))}</>
  ), [colors, classes.roundedTop, classes.roundedBottom]);

  return (<>
    <OutlinedBox label='Colors' style={{ marginTop: '8px' }}>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId={`edit-fade-${droppableCount++}`}>
          { provided => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              <ColorTiles />
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <Button className={classes.buttonAdd} variant='outlined' onClick={onClickAdd}>Add Color</Button>
    </OutlinedBox>
    <Button className={classes.buttonConfirm} variant='outlined' onClick={onClickConfirm}>Confirm</Button>
  </>)
}

export default EditFadePattern;
