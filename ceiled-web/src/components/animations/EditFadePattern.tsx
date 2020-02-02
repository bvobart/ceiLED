import React, { useState } from 'react';
import { Button, makeStyles } from '@material-ui/core';
import { FadePattern, PatternType } from '../../api/patterns';
import { HSVColor } from '../color-picking/colors';
import OutlinedBox from '../global/OutlinedBox';
import { EditableTile } from '../tiles';
import { replace, remove } from './utils';

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

  return (<>
    <OutlinedBox label='Colors' style={{ marginTop: '8px' }}>
      {colors.map((color, index) => (
        <EditableTile
          // make the first tile have rounded top and last tile have rounded bottom
          className={index === 0 ? classes.roundedTop : index === colors.length - 1 ? classes.roundedBottom : undefined}
          key={`edittile-${index}`} 
          hsv={color} 
          onEditConfirm={newColor => setColors(replace(colors, index, newColor))}
          onDelete={() => {
            const [cs] = remove(colors, index);
            setColors(cs);
          }}
        />
      ))}
      <Button className={classes.buttonAdd} variant='outlined' onClick={onClickAdd}>Add Color</Button>
    </OutlinedBox>
    <Button className={classes.buttonConfirm} variant='outlined' onClick={onClickConfirm}>Confirm</Button>
  </>)
}

export default EditFadePattern;
