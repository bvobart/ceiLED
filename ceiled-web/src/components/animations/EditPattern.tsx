import React, { useState, useRef, useEffect } from 'react';
import { makeStyles, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
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
  }
});

interface EditPatternProps {
  pattern?: Pattern;
  onConfirm: (pattern: Pattern) => void;
}

const EditPattern = (props: EditPatternProps) => {
  const { pattern, onConfirm } = props;
  const classes = useStyles();
  const defaultType = pattern ? pattern.type : PatternType.SOLID;
  const [patternType, setPatternType] = useState<PatternType>(defaultType);

  // ensures that the outline of the selection box is broken by the label
  const inputLabel = useRef<HTMLLabelElement>(null);
  const [labelWidth, setLabelWidth] = useState(0);
  useEffect(() => {
    setLabelWidth(inputLabel.current ? inputLabel.current.offsetWidth : 0);
  }, []);

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
      <Editor type={patternType} pattern={pattern} onConfirm={onConfirm} />
    </div>
  )
}

export default EditPattern;

interface EditorProps {
  type: PatternType;
  pattern?: Pattern;
  onConfirm: (pattern: Pattern) => void;
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
