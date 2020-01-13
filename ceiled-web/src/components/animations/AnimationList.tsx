import React, { useState, FunctionComponent } from 'react';
import { List, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { Animation, Pattern, Solid, FadeLinear, FadeSigmoid } from '.';
import { SolidTile, FadeLinearTile, FadeSigmoidTile } from './tiles';
import AddPattern from './AddPattern';
import DraggableItem from './DraggableItem';

export interface AnimationListProps {
  className?: string;
  channel?: number;
  animation: Animation;
  onChange: (anim: Animation) => void;
}

const useStyles = makeStyles({
  button: {
    width: '100%',
    marginTop: '4px',
    minHeight: '48px',
  },
  label: {
    width: '100%',
  },
  picker: {
    minHeight: '276px',
    marginTop: '8px',
  },
  solidTile: {
    borderRadius: '4px',
    minHeight: '48px',
    width: '100%',
  },
  fadeTile: {
    borderRadius: '4px',
    width: '100%',
  },
});

const AnimationList: FunctionComponent<AnimationListProps> = (props) => {
  const { animation } = props;
  const classes = useStyles();
  const [adding, setAdding] = useState<boolean>(false);

  // TODO: allow tiles to be edited / removed
  // TODO: refactor this code so it is actually readable again

  const onAddPattern = (pattern: Pattern) => {
    props.onChange([...animation, pattern]);
    setAdding(false);
  };

  return (
    <div className={props.className} key={`animation-list-${props.channel}`}>
      <List disablePadding>
        {
          animation.map((pattern: Pattern) => {
            if (pattern instanceof Solid) {
              return <SolidTile className={classes.solidTile} pattern={pattern}/>
            }
            if (pattern instanceof FadeLinear) {
              return <FadeLinearTile className={classes.fadeTile} pattern={pattern} height={`${48 * pattern.length}px`} />
            }
            if (pattern instanceof FadeSigmoid) {
              return <FadeSigmoidTile className={classes.fadeTile} pattern={pattern} height={`${48 * pattern.length}px`} />
            }
            return <div className={classes.solidTile}>NONE</div>
          }).map((elem, index) => {
            const key = `li-${props.channel}-${index}`;
            const draggableIndex = ((props.channel || 0) + 1) * 1000 + index;  
            return <DraggableItem key={key} index={draggableIndex}>{elem}</DraggableItem>
          })
        }
        {props.children}
      </List>
      { 
        adding 
        ? <AddPattern onConfirm={onAddPattern} />
        : <Button className={classes.button} variant='outlined' onClick={() => setAdding(true)}>Add</Button>
      }
    </div>
  )
}

// interface AddColorProps {
//   onConfirm: (color: HSVColor) => void
// }

// const AddColor = (props: AddColorProps) => {
//   const classes = useStyles();
//   const defaultColor = new HSVColor({ h: 0, s: 1, v: 1 });
//   const [selectedColor, setSelectedColor] = useState<HSVColor>(defaultColor);
  
//   return (<>
//     <Button className={classes.button} variant='outlined' onClick={() => props.onConfirm(selectedColor)}
//       style={{ background: selectedColor.toCSS() }}
//     >
//       Confirm
//     </Button>
//     <ColorPicker className={classes.picker} hsv={selectedColor} onChange={setSelectedColor} />
//   </>)
// }

// interface AddTransitionProps {
//   onClick: (type: TransitionType) => void
// }

// const AddTransition = (props: AddTransitionProps) => {
//   const classes = useStyles();
//   return (
//     <Grid container className={classes.addTransition} alignItems='center' alignContent='center' justify='center'>
//       <Grid item xs={1}><BlurLinearIcon fontSize='inherit' onClick={() => props.onClick(TransitionType.FADE_LINEAR)} /></Grid>
//       <Grid item xs={1}><BlurCircularIcon fontSize='inherit' onClick={() => props.onClick(TransitionType.FADE_SIGMOID)} /></Grid>
//     </Grid>
//   )
// }

export default AnimationList;
