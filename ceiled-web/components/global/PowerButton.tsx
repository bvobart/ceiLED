import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import { IconButton, IconButtonProps } from '@mui/material';
import { green, red } from '@mui/material/colors';
import React, { forwardRef } from 'react';
import { CeiledStatus } from '../../api';
import config from '../../config';
import useCeiled from '../../hooks/api/useCeiled';

/**
 * The power button at the top right of the header.
 * When clicked, connects to the server at address `config.serverAddress`
 *
 * TODO: implement showing 'connecting' as orange or so
 */
const PowerButton = forwardRef<HTMLButtonElement, IconButtonProps>((props, ref) => {
  const [status, connect, off] = useCeiled();

  const onClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (props.onClick) props.onClick(event);
    connect(config.serverAddress);
  };

  return (
    <IconButton
      {...props}
      ref={ref}
      onClick={onClick}
      onDoubleClick={() => off()}
      size='large'
      sx={{ color: status === CeiledStatus.CONNECTED ? green.A700 : red.A700 }}
    >
      <PowerSettingsNewIcon sx={{ width: '96px', height: '96px' }} />
      {props.children}
    </IconButton>
  );
});

PowerButton.displayName = 'PowerButton';
export default PowerButton;
