import React, { useState } from 'react';
import { Pattern, Solid, PatternType, FadeLinear } from '.';
import { HSVColor } from '../color-picking/colors';
import { Grid, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
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
  const defaultPattern = new Solid(new HSVColor({ h: 0, s: 1, v: 1 }), 1);
  
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
  if (selectedType === PatternType.FADE_LINEAR) {
    const fade = new FadeLinear([new HSVColor({ h: 0, s: 1, v: 1 }), new HSVColor({ h: 0.25, s: 1, v: 1 }), new HSVColor({ h: 0.5, s: 1, v: 1})], 3);
    return <Button className={classes.button} variant='outlined' onClick={() => props.onConfirm(fade)}>!Fade TODO!</Button>
  }

  return <Button className={classes.button} variant='outlined' onClick={() => props.onConfirm(defaultPattern)}>!TODO!</Button>
}

export default AddPattern;
