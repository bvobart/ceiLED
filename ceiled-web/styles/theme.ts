import { deepPurple } from '@material-ui/core/colors';
import { createTheme } from '@material-ui/core/styles';

const boxShadow = '0px 2px 3px rgba(0,0,0,.5)';

export const theme = createTheme({
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
