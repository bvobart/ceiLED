import React, { forwardRef } from 'react';
import { IconButton, makeStyles, IconButtonProps } from '@material-ui/core';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import { CeiledStatus } from '../../api';
import config from '../../config';
import useCeiled from '../../hooks/api/useCeiled';
import { red, green } from '@material-ui/core/colors';

const useStyles = makeStyles({
  icon: {
    width: '100%',
    height: '100%',
  },
  off: {
    color: red.A400,
  },
  on: {
    color: green.A400,
  },
});

/**
 * The power button at the top right of the header.
 * When clicked, connects to the server at address `config.serverAddress`
 *
 * TODO: implement showing 'connecting' as orange or so
 */
const PowerButton = forwardRef<HTMLButtonElement, IconButtonProps>((props, ref) => {
  const classes = useStyles();
  const [status, connect, off] = useCeiled();

  const onClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (props.onClick) props.onClick(event);
    connect(config.serverAddress);
  };

  return (
    <IconButton
      {...props}
      ref={ref}
      color={status !== CeiledStatus.CONNECTED ? 'primary' : 'secondary'}
      classes={{
        colorPrimary: classes.off,
        colorSecondary: classes.on,
      }}
      onClick={onClick}
      onDoubleClick={() => off()}
    >
      <PowerSettingsNewIcon className={classes.icon} />
      {props.children}
    </IconButton>
  );
});

PowerButton.displayName = 'PowerButton';
export default PowerButton;
