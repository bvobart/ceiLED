import InputLabel from '@mui/material/InputLabel';
import React, { CSSProperties, FunctionComponent, ReactNode } from 'react';
import NotchedOutline from './NotchedOutline';

// Heavily inspired by:
// https://stackoverflow.com/questions/58402130/how-can-i-set-an-static-outlined-div-similar-to-material-uis-outlined-textfield/58421725#58421725

const inputLabelStyles = {
  position: 'absolute',
  left: 0,
  top: 0,
};

export interface OutlinedBoxProps {
  id?: string;
  label?: ReactNode;
  style?: CSSProperties;
}

const OutlinedBox: FunctionComponent<OutlinedBoxProps> = props => {
  const { id, label, children, style } = props;
  return (
    <div style={{ ...style, position: 'relative', width: '100%' }}>
      <InputLabel htmlFor={id} variant='outlined' shrink sx={inputLabelStyles}>
        {label}
      </InputLabel>
      <div style={{ position: 'relative' }}>
        <div id={id} style={{ padding: '8px' }}>
          {children}
          <NotchedOutline notched label={label} style={{ borderRadius: '4px' }} />
        </div>
      </div>
    </div>
  );
};
export default OutlinedBox;
