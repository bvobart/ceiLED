import React, { useState, useRef, FunctionComponent, useEffect, ReactNode, CSSProperties } from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import NotchedOutline from '@material-ui/core/OutlinedInput/NotchedOutline';
import { makeStyles } from '@material-ui/core/styles';

// Heavily inspired by:
// https://stackoverflow.com/questions/58402130/how-can-i-set-an-static-outlined-div-similar-to-material-uis-outlined-textfield/58421725#58421725

const useStyles = makeStyles({
  root: {
    position: 'relative',
  },
  content: {
    padding: '8px',
  },
  inputLabel: {
    position: 'absolute',
    left: 0,
    top: 0,
    transform: 'translate(0, 24px) scale(1)',
  },
});

export interface OutlinedBoxProps {
  id?: string;
  label?: ReactNode;
  style?: CSSProperties;
}

const OutlinedBox: FunctionComponent<OutlinedBoxProps> = props => {
  const { id, label, children, style } = props;
  const classes = useStyles();

  const [labelWidth, setLabelWidth] = useState(0);
  const labelRef = useRef<HTMLLabelElement>(null);
  useEffect(() => setLabelWidth(labelRef.current ? labelRef.current.offsetWidth : 0), [label]);

  return (
    <div style={{ ...style, position: 'relative', width: '100%' }}>
      <InputLabel ref={labelRef} htmlFor={id} variant='outlined' className={classes.inputLabel} shrink>
        {label}
      </InputLabel>
      <div className={classes.root}>
        <div id={id} className={classes.content}>
          {children}
          <NotchedOutline notched labelWidth={labelWidth} />
        </div>
      </div>
    </div>
  );
};
export default OutlinedBox;
