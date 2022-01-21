import { deepPurple } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';

const boxShadow = '0px 2px 3px rgba(0,0,0,.5)';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: deepPurple.A200,
    },
    background: {
      paper: '#1A181C',
      default: '#121212',
    },
  },
  components: {
    MuiSlider: {
      styleOverrides: {
        rail: { boxShadow },
        thumb: { boxShadow },
      },
    },
    MuiButton: {
      styleOverrides: {
        outlined: { boxShadow },
        text: { boxShadow },
      },
    },
  },
});
