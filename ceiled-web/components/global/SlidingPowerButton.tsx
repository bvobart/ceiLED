import { IconButtonProps, Slide } from '@mui/material';
import React, { forwardRef, useEffect, useState } from 'react';
import { CeiledStatus } from '../../api';
import useCeiled from '../../hooks/api/useCeiled';
import PowerButton from './PowerButton';

/**
 * A version of the PowerButton that comes sliding in from the edge of the screen upon setting the `in` prop to true,
 * and slides back out again when setting `in` to false. When the button is clicked when it is in, it will stay in
 * until it is connected, or until the attempt at establishing a connection times out.
 */
export const SlidingPowerButton = forwardRef<HTMLButtonElement, IconButtonProps & { in: boolean }>((props, ref) => {
  const { in: initIn, onClick, ...buttonProps } = props;
  const [show, setShow] = useState(initIn);
  useEffect(() => setShow(initIn), [initIn]);

  const [status] = useCeiled();
  useEffect(() => {
    if (status === CeiledStatus.CONNECTED) {
      setTimeout(() => setShow(false), 500);
    } else if (status === CeiledStatus.ERROR) {
      setTimeout(() => setShow(false), 2000);
    }
  }, [status]);

  const [hideTimout, setHideTimeout] = useState<NodeJS.Timeout | null>(null);

  const onClickPower = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.stopPropagation();
    hideTimout && clearTimeout(hideTimout);
    setHideTimeout(null);
    onClick && onClick(event);
  };

  return (
    <Slide ref={ref} direction='down' in={show} mountOnEnter unmountOnExit>
      <PowerButton {...buttonProps} onClick={onClickPower} />
    </Slide>
  );
});

SlidingPowerButton.displayName = 'SlidingPowerButton';
