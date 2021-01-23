import React, { useState, useCallback } from 'react';
import { Button, makeStyles, Grid } from '@material-ui/core';
import { FadePattern, PatternType } from '../../api/patterns';
import { HSVColor } from '../color-picking/colors';
import OutlinedBox from '../global/OutlinedBox';
import { EditableTile } from '../tiles';
import { replace, remove, reorder } from './utils';
import { DragDropContext, DropResult, Droppable } from 'react-beautiful-dnd';
import DraggableDiv from './dragdrop/DraggableDiv';

const useStyles = makeStyles({
  buttonCancel: {
    width: '100%',
    marginTop: '8px',
    minHeight: '48px',
    background: '#b2102f',
  },
  buttonConfirm: {
    width: '100%',
    marginTop: '8px',
    minHeight: '48px',
    background: '#00a152',
  },
  buttonAdd: {
    width: '100%',
    minHeight: '32px',
  },
  roundedTop: {
    borderRadius: '4px 4px 0px 0px',
  },
  roundedBottom: {
    borderRadius: '0px 0px 4px 4px',
  },
});

let droppableCount = 0;

export interface EditFadePatternProps {
  pattern?: FadePattern;
  onConfirm: (pattern: FadePattern | undefined) => void;
  type: PatternType.FADE_LINEAR | PatternType.FADE_SIGMOID;
}

const EditFadePattern = (props: EditFadePatternProps): JSX.Element => {
  const { pattern: initialPattern, onConfirm, type } = props;
  const classes = useStyles();
  const defaultColors = initialPattern ? initialPattern.colors.map(c => c.toHSV()) : [HSVColor.random()];
  const [colors, setColors] = useState<HSVColor[]>(defaultColors);

  const onClickAdd = () => {
    setColors([...colors, HSVColor.random()]);
  };

  const onClickConfirm = () => {
    const length = initialPattern ? initialPattern.length : colors.length;
    const rgbs = colors.map(c => c.toRGB());
    onConfirm(new FadePattern(type, length, rgbs));
  };

  const onClickCancel = () => onConfirm(initialPattern);

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
  };

  /**
   * ColorTiles is a sub-component that renders the list of draggable, editable color tiles.
   * Needs to be separate component, else the list won't rerender upon drag 'n drop.
   */
  const ColorTiles = useCallback(
    () => (
      <>
        {colors.map((color, index) => (
          <DraggableEditableTile
            // make the first tile have rounded top and last tile have rounded bottom
            key={`edittile-${index}`}
            className={
              index === 0 ? classes.roundedTop : index === colors.length - 1 ? classes.roundedBottom : undefined
            }
            color={color}
            index={index}
            onEditConfirm={newColor => {
              setColors(replace(colors, index, newColor));
            }}
            onDelete={() => {
              const [cs] = remove(colors, index);
              setColors(cs);
            }}
          />
        ))}
      </>
    ),
    [colors, classes.roundedTop, classes.roundedBottom],
  );

  return (
    <>
      <OutlinedBox label='Colors' style={{ marginTop: '8px' }}>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId={`edit-fade-${droppableCount++}`}>
            {provided => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                <ColorTiles />
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        <Button className={classes.buttonAdd} variant='outlined' onClick={onClickAdd}>
          Add Color
        </Button>
      </OutlinedBox>
      <Grid container>
        <Grid item xs={8}>
          <Button className={classes.buttonConfirm} variant='outlined' onClick={onClickConfirm}>
            Confirm
          </Button>
        </Grid>
        <Grid item xs={4}>
          <Button className={classes.buttonCancel} variant='outlined' onClick={onClickCancel}>
            Cancel
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default EditFadePattern;

interface DraggableEditableTileProps {
  className?: string;
  color: HSVColor;
  index: number;
  onEditConfirm: (color: HSVColor) => void;
  onDelete: () => void;
}

/**
 * DraggableEditableTile is a draggable and editable color tile that disables drag and drop while editing the color.
 */
const DraggableEditableTile = (props: DraggableEditableTileProps) => {
  const { className, color, index, onEditConfirm, onDelete } = props;
  const [dragDisabled, setDragDisabled] = useState(false);
  return (
    <DraggableDiv index={index} disabled={dragDisabled}>
      <EditableTile
        className={className}
        hsv={color}
        onEditStart={() => {
          setDragDisabled(true);
        }}
        onEditConfirm={newColor => {
          setDragDisabled(false);
          onEditConfirm(newColor);
        }}
        onDelete={onDelete}
      />
    </DraggableDiv>
  );
};
