import { Button, Grid } from '@mui/material';
import React, { useState } from 'react';
import { HSVColor } from '../../api/colors';
import { SolidPattern } from '../../api/patterns';
import ColorPicker from '../colorpicking/ColorPicker';

const marginTop = '4px';
const buttonStyles = {
  minHeight: '48px',
  width: '100%',
  marginTop,
};

export interface EditSolidPatternProps {
  pattern?: SolidPattern;
  onConfirm: (pattern: SolidPattern | undefined) => void;
}

const key = 'animations-pick-solid';

const EditSolidPattern = (props: EditSolidPatternProps): JSX.Element => {
  const { pattern: initialPattern, onConfirm } = props;
  const previousColor = getSavedColor();
  const defaultColor = initialPattern ? initialPattern.color.toHSV() : previousColor;
  const [color, setColor] = useState<HSVColor>(defaultColor);

  const onClickConfirm = () => {
    if (!initialPattern) setSavedColor(color);
    const length = initialPattern ? initialPattern.length : 1;
    onConfirm(new SolidPattern(length, color.toRGB()));
  };

  const onClickCancel = () => onConfirm(initialPattern);

  return (
    <>
      <ColorPicker hsv={color} onChange={setColor} style={{ marginTop }} />
      <Grid container justifyContent='space-between'>
        <Grid item xs={8}>
          <Button
            variant='outlined'
            onClick={onClickConfirm}
            style={{ ...buttonStyles, background: color.toCSS(), color: color.textCSS() }}
          >
            Confirm
          </Button>
        </Grid>
        <Grid item xs={4}>
          <Button
            variant='outlined'
            onClick={onClickCancel}
            style={{ ...buttonStyles, background: '#b2102f', color: 'white' }}
          >
            Cancel
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

const getSavedColor = (): HSVColor => {
  const saved = localStorage.getItem(key);
  return saved ? new HSVColor(JSON.parse(saved)) : HSVColor.random();
};

const setSavedColor = (color: HSVColor): void => {
  localStorage.setItem(key, JSON.stringify(color));
};

export default EditSolidPattern;
