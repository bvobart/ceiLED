import React, { useState } from 'react';
import { Grid, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { Pattern, SolidPattern, PatternType, FadePattern } from '../../api/patterns';
import { RGBColor } from '../color-picking/colors';
import AddSolidPattern from './AddSolidPattern';

const useStyles = makeStyles({
  button: {
    width: '100%',
    marginTop: '4px',
    minHeight: '48px',
  },
});

interface AddPatternProps {
  onConfirm: (pattern: Pattern) => void
}

const AddPattern = (props: AddPatternProps) => {
  const classes = useStyles();
  const [selectedType, setSelectedType] = useState<PatternType | undefined>(undefined);
  const defaultPattern = new SolidPattern(1, new RGBColor({ red: 255, green: 0, blue: 0 }));
  
  if (!selectedType) {
    // TODO: fix layout of this thing
    return (
      <Grid container>
        <Grid item>
          <Button className={classes.button} variant='outlined' onClick={() => setSelectedType(PatternType.SOLID)}>Solid</Button>
        </Grid>
        <Grid item>
          <Button className={classes.button} variant='outlined' onClick={() => setSelectedType(PatternType.FADE_LINEAR)}>Linear Fade</Button>
        </Grid>
        <Grid item>
          <Button className={classes.button} variant='outlined' onClick={() => setSelectedType(PatternType.FADE_SIGMOID)}>Sigmoid Fade</Button>
        </Grid>
      </Grid>
    )
  }
  
  if (selectedType === PatternType.SOLID) {
    return <AddSolidPattern onConfirm={(pattern) => props.onConfirm(pattern)} />
  }

  // TODO: implement AddFadePattern
  if (selectedType === PatternType.FADE_LINEAR || selectedType === PatternType.FADE_SIGMOID) {
    const fade = new FadePattern(selectedType, 3, [new RGBColor({ red: 255, green: 0, blue: 0 }), new RGBColor({ red: 255, green: 255, blue: 0 }), new RGBColor({ red: 0, green: 255, blue: 0 })]);
    return <Button className={classes.button} variant='outlined' onClick={() => props.onConfirm(fade)}>!Fade TODO!</Button>
  }

  return <Button className={classes.button} variant='outlined' onClick={() => props.onConfirm(defaultPattern)}>!TODO!</Button>
}

export default AddPattern;
