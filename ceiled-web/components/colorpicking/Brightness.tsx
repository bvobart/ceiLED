import { Slider, Theme } from '@mui/material';
import type { SxProps } from '@mui/system';
import React from 'react';

export interface BrightnessProps {
  className?: string;
  value: number;
  onChange: (newValue: number) => void;
  sx?: SxProps<Theme>;
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
      sx={props.sx}
    />
  );
};

export default React.memo(Brightness);
