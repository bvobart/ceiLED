import { alpha, Card, Grid, SxProps, Theme } from '@mui/material';
import BrightnessSlider from '../components/global/BrightnessSlider';
import FluxSlider from '../components/global/FluxSlider';
import RoomlightSlider from '../components/global/RoomlightSlider';

const styles: { slider: SxProps<Theme> } = {
  slider: theme => {
    // override default slider thumb box shadow to be smaller so that each slider can be smaller in height
    const boxShadow = (height: number): string => `0px 0px 0px ${height}px ${alpha(theme.palette.primary.main, 0.16)}`;

    return {
      // set vertical padding to 8px so that sliders are smaller.
      '@media (pointer: coarse)': { py: 1 },
      '& .MuiSlider-thumb': {
        boxShadow: 'none',
        '&:focus, &:hover': {
          boxShadow: boxShadow(4),
          '@media (hover: none)': { boxShadow: 'none' },
        },
        '&.Mui-active': {
          boxShadow: boxShadow(6),
          '@media (hover: none)': { boxShadow: 'none' },
        },
      },
    };
  },
};

const GlobalControls = (): JSX.Element => {
  return (
    <Card sx={{ borderRadius: '4px', px: 2, paddingTop: 0, paddingBottom: 1 }}>
      <Grid container justifyContent='space-between' alignItems='center' spacing={{ xs: 0, sm: 0, md: 1 }}>
        <BrightnessSlider styles={styles} />
        <RoomlightSlider styles={styles} />
        <FluxSlider styles={styles} />
      </Grid>
    </Card>
  );
};

export default GlobalControls;
