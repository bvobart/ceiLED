import React, { useState, FunctionComponent } from 'react';
import { List, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { Animation, Pattern } from '../../api/patterns';
import { PatternTile } from './tiles';
import DraggableItem from './DraggableItem';
import EditPattern from './EditPattern';

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
});

const AnimationList: FunctionComponent<AnimationListProps> = (props) => {
  const { animation } = props;
  const classes = useStyles();
  const [adding, setAdding] = useState<boolean>(false);

  // TODO: allow tiles to be edited / removed

  const onAddPattern = (pattern: Pattern) => {
    props.onChange([...animation, pattern]);
    setAdding(false);
  };

  return (
    <div className={props.className} key={`animation-list-${props.channel}`}>
      <List disablePadding>
        {
          animation.map((pattern: Pattern) => <PatternTile pattern={pattern} />).map((elem, index) => {
            const key = `li-${props.channel}-${index}`;
            const draggableIndex = ((props.channel || 0) + 1) * 1000 + index;  
            return <DraggableItem key={key} index={draggableIndex}>{elem}</DraggableItem>
          })
        }
        {props.children}
      </List>
      { 
        adding 
        ? <EditPattern onConfirm={onAddPattern} />
        : <Button className={classes.button} variant='outlined' onClick={() => setAdding(true)}>Add</Button>
      }
    </div>
  )
}

export default AnimationList;
