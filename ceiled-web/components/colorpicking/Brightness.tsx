import React from 'react';
import { Slider } from '@material-ui/core';

export interface BrightnessProps {
  className?: string;
  value: number;
  onChange: (newValue: number) => void;
}

const Brightness = (props: BrightnessProps) => {
  const { className, value, onChange } = props;
  return (
    <Slider
      className={className}
      value={value}
      onChange={(_, newValue) => value !== newValue && onChange(newValue as number)}
      min={0}
      max={1}
      step={0.01}
    />
  );
};

export default React.memo(Brightness);
