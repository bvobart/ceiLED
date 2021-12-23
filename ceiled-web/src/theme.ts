import { createMuiTheme } from '@material-ui/core';
import { deepPurple } from '@material-ui/core/colors';

const boxShadow = '0px 2px 3px rgba(0,0,0,.5)';

export const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: deepPurple,
  },
  overrides: {
    MuiSlider: {
      rail: { boxShadow },
      thumb: { boxShadow },
    },
    MuiButton: {
      outlined: { boxShadow },
      text: { boxShadow },
    },
  },
});
