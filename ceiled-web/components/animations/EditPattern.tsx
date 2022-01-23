import { FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import React, { useState } from 'react';
import { FadePattern, Pattern, PatternType, SolidPattern } from '../../api/patterns';
import EditFadePattern from './EditFadePattern';
import EditSolidPattern from './EditSolidPattern';

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
const EditPattern = (props: EditPatternProps): JSX.Element => {
  const { pattern, onConfirm } = props;
  const defaultType = pattern ? pattern.type : PatternType.SOLID;
  const [patternType, setPatternType] = useState<PatternType>(defaultType);
  const defaultLength = pattern ? pattern.length : 1;
  const [length, setLength] = useState(defaultLength);

  // upon changing the pattern length
  const onChangeLength = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newLength = parseInt(event.target.value);
    if (newLength > 0) setLength(newLength);
  };

  // upon confirming the new pattern in the editor
  const onEditorConfirm = (newPattern: Pattern | undefined) => {
    if (newPattern) newPattern.length = length;
    onConfirm(newPattern);
  };

  const isEditing = pattern !== undefined;
  const isEditingFade =
    pattern && (pattern.type === PatternType.FADE_LINEAR || pattern.type === PatternType.FADE_SIGMOID);

  const label = 'Pattern Type';
  return (
    <div style={{ width: '100%' }}>
      {(!isEditing || (isEditing && isEditingFade)) && (
        <FormControl variant='outlined' margin='dense' sx={{ width: '100%' }}>
          <InputLabel id='select-patterntype-label'>{label}</InputLabel>
          <Select
            labelId='select-patterntype-label'
            id='select-patterntype'
            value={patternType}
            onChange={event => setPatternType(event.target.value as PatternType)}
            label={label}
            sx={{ minHeight: '44px' }}
          >
            {!isEditing && <MenuItem value={PatternType.SOLID}>Solid</MenuItem>}
            <MenuItem value={PatternType.FADE_LINEAR}>Linear Fade</MenuItem>
            <MenuItem value={PatternType.FADE_SIGMOID}>Sigmoid Fade</MenuItem>
          </Select>
        </FormControl>
      )}
      <TextField
        variant='outlined'
        label='Length'
        margin='dense'
        type='number'
        value={length}
        onChange={onChangeLength}
        sx={{ marginTop: '8px' }}
      />
      <Editor type={patternType} pattern={pattern} onConfirm={onEditorConfirm} />
    </div>
  );
};

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
      return <EditSolidPattern pattern={pattern as SolidPattern | undefined} onConfirm={onConfirm} />;
    case PatternType.FADE_LINEAR:
      return <EditFadePattern type={type} pattern={pattern as FadePattern | undefined} onConfirm={onConfirm} />;
    case PatternType.FADE_SIGMOID:
      return <EditFadePattern type={type} pattern={pattern as FadePattern | undefined} onConfirm={onConfirm} />;

    default:
      return <div />;
  }
};
