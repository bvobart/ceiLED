import { Button, Grid } from '@mui/material';
import React, { CSSProperties, useCallback, useState } from 'react';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import { HSVColor } from '../../api/colors';
import { FadePattern, PatternType } from '../../api/patterns';
import { EditableTile } from '../tiles';
import OutlinedBox from '../tiles/OutlinedBox';
import DraggableDiv from './dragdrop/DraggableDiv';
import { remove, reorder, replace } from './utils';

const marginTop = '4px';
const buttonStyles = {
  minHeight: '48px',
  width: '100%',
  marginTop,
};

const roundedTop = {
  borderRadius: '4px 4px 0px 0px',
};
const roundedBottom = {
  borderRadius: '0px 0px 4px 4px',
};

let droppableCount = 0;

export interface EditFadePatternProps {
  pattern?: FadePattern;
  onConfirm: (pattern: FadePattern | undefined) => void;
  type: PatternType.FADE_LINEAR | PatternType.FADE_SIGMOID;
}

const EditFadePattern = (props: EditFadePatternProps): JSX.Element => {
  const { pattern: initialPattern, onConfirm, type } = props;
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
            key={`edittile-${index}`}
            color={color}
            index={index}
            onEditConfirm={newColor => {
              setColors(replace(colors, index, newColor));
            }}
            onDelete={() => {
              const [cs] = remove(colors, index);
              setColors(cs);
            }}
            // make the first tile have rounded top and last tile have rounded bottom
            style={{ ...(index === 0 ? roundedTop : index === colors.length - 1 ? roundedBottom : {}) }}
          />
        ))}
      </>
    ),
    [colors],
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
        <Button variant='outlined' onClick={onClickAdd} sx={{ ...buttonStyles }}>
          Add Color
        </Button>
      </OutlinedBox>
      <Grid container>
        <Grid item xs={8}>
          <Button
            variant='outlined'
            onClick={onClickConfirm}
            sx={{ ...buttonStyles, background: '#00a152', color: 'white' }}
          >
            Confirm
          </Button>
        </Grid>
        <Grid item xs={4}>
          <Button
            variant='outlined'
            onClick={onClickCancel}
            sx={{ ...buttonStyles, background: '#b2102f', color: 'white' }}
          >
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
  style?: CSSProperties;
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
        style={props.style}
      />
    </DraggableDiv>
  );
};
