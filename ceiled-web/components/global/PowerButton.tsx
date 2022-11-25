import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import { IconButton, IconButtonProps } from '@mui/material';
import { deepOrange, green, orange, red } from '@mui/material/colors';
import React, { forwardRef, useMemo } from 'react';
import { CeiledStatus } from '../../api';
import config from '../../config';
import useCeiled from '../../hooks/api/useCeiled';

/**
 * The power button at the top right of the header.
 * When clicked, connects to the server at address `config.serverAddress`
 */
const PowerButton = forwardRef<HTMLButtonElement, IconButtonProps>((props, ref) => {
  const [status, connect, off] = useCeiled();

  const onClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (props.onClick) props.onClick(event);
    connect(config.serverAddress);
  };

  const color = useMemo(() => {
    switch (status) {
      case CeiledStatus.CONNECTED:
        return green.A700;
      case CeiledStatus.CONNECTING:
        return orange.A700;
      case CeiledStatus.DISCONNECTED:
        return deepOrange.A700;
      case CeiledStatus.ERROR:
        return red.A700;
    }
  }, [status]);

  return (
    <IconButton {...props} ref={ref} onClick={onClick} onDoubleClick={() => off()} size='large' sx={{ color }}>
      <PowerSettingsNewIcon sx={{ width: '64px', height: '64px' }} />
      {props.children}
    </IconButton>
  );
});

PowerButton.displayName = 'PowerButton';
export default PowerButton;
