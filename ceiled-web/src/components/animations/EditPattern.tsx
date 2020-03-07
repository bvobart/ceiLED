import React, { useState, useRef, useEffect } from 'react';
import { makeStyles, FormControl, InputLabel, Select, MenuItem, TextField } from '@material-ui/core';
import { Pattern, PatternType, SolidPattern, FadePattern } from '../../api/patterns';
import EditSolidPattern from './EditSolidPattern';
import EditFadePattern from './EditFadePattern';

const useStyles = makeStyles({
  root: {
    width: '100%',
  },  
  typeForm: {
    width: '100%',
  },
  select: {
    minHeight: '44px',
  },
  lengthField: {
    marginTop: '8px',
  }
});

interface EditPatternProps {
  pattern?: Pattern;
  onConfirm: (pattern: Pattern | undefined) => void;
}

/**
 * Component to compose a new pattern or edit an existing one.
 * 
 * TODO: add new menu option and editor for 'Predefined', where user can pick from a couple of quick 'n easy predefined patterns.
 * TODO: if creating a new pattern, on confirm, save the selected pattern type to localStorage
 * TODO: if creating a new pattern, use previously selected pattern type as defaultType.
 */
const EditPattern = (props: EditPatternProps) => {
  const { pattern, onConfirm } = props;
  const classes = useStyles();
  const defaultType = pattern ? pattern.type : PatternType.SOLID;
  const [patternType, setPatternType] = useState<PatternType>(defaultType);
  const defaultLength = pattern ? pattern.length : 1;
  const [length, setLength] = useState(defaultLength);

  // ensures that the outline of the selection box is broken by the label
  const inputLabel = useRef<HTMLLabelElement>(null);
  const [labelWidth, setLabelWidth] = useState(0);
  useEffect(() => {
    setLabelWidth(inputLabel.current ? inputLabel.current.offsetWidth : 0);
  }, []);

  // upon changing the pattern length
  const onChangeLength = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newLength = parseInt(event.target.value);
    if (newLength > 0) setLength(newLength);
  }

  // upon confirming the new pattern in the editor
  const onEditorConfirm = (newPattern: Pattern | undefined) => {
    if (newPattern) newPattern.length = length;
    onConfirm(newPattern);
  }

  const isEditing = pattern !== undefined;
  const isEditingFade = pattern && (pattern.type === PatternType.FADE_LINEAR || pattern.type === PatternType.FADE_SIGMOID)

  return (
    <div className={classes.root}>
      { (!isEditing || (isEditing && isEditingFade)) && 
        <FormControl className={classes.typeForm} variant='outlined' margin='dense'>
          <InputLabel ref={inputLabel} id='select-patterntype-label'>Pattern Type</InputLabel>
          <Select
            className={classes.select}
            labelId='select-patterntype-label'
            id='select-patterntype'
            value={patternType}
            onChange={event => setPatternType(event.target.value as PatternType)}
            labelWidth={labelWidth}
          >
            { !isEditing && <MenuItem value={PatternType.SOLID}>Solid</MenuItem>}
            <MenuItem value={PatternType.FADE_LINEAR}>Linear Fade</MenuItem>
            <MenuItem value={PatternType.FADE_SIGMOID}>Sigmoid Fade</MenuItem>
          </Select>
        </FormControl>
      }
      <TextField 
        className={classes.lengthField} 
        variant='outlined' 
        label='Length' 
        margin='dense'
        type='number' 
        value={length} 
        onChange={onChangeLength} 
      />
      <Editor type={patternType} pattern={pattern} onConfirm={onEditorConfirm} />
    </div>
  )
}

export default EditPattern;

interface EditorProps {
  type: PatternType;
  pattern?: Pattern;
  onConfirm: (pattern: Pattern | undefined) => void;
}

const Editor = (props: EditorProps) => {
  const { pattern, type, onConfirm } = props;
  switch (type) {
    case PatternType.SOLID:
      return <EditSolidPattern pattern={pattern as SolidPattern | undefined} onConfirm={onConfirm} />
    case PatternType.FADE_LINEAR:
      return <EditFadePattern type={type} pattern={pattern as FadePattern | undefined} onConfirm={onConfirm} />
    case PatternType.FADE_SIGMOID:
      return <EditFadePattern type={type} pattern={pattern as FadePattern | undefined} onConfirm={onConfirm} />
    
    default:
      return <div />
  }
}
