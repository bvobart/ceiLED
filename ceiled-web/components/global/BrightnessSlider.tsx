import type { SxProps, Theme } from '@mui/material';
import { Grid, Slider, Typography } from '@mui/material';
import useBrightness from '../../hooks/api/useBrightness';

interface BrightnessSliderProps {
  className?: string;
  styles?: {
    slider: SxProps<Theme>;
  };
}

const BrightnessSlider = (props: BrightnessSliderProps): JSX.Element => {
  const [brightness, setBrightness] = useBrightness();

  return (
    <Grid
      className={props.className}
      container
      item
      alignItems='center'
      justifyContent='space-between'
      py={{ xs: 0, sm: 1 }}
    >
      <Grid container item xs={6} sm={2} alignItems='center' justifyContent='space-between'>
        <Grid item xs={4} sm={1}>
          <Typography variant='caption'>Brightness</Typography>
        </Grid>
        <Grid item xs={2} sm={1}>
          <Typography variant='caption'>{brightness}%</Typography>
        </Grid>
      </Grid>
      <Grid item xs={12} sm={9}>
        <Slider
          value={brightness}
          onChange={(_, newBrightness) => brightness !== newBrightness && setBrightness(newBrightness as number)}
          min={0}
          max={100}
          step={1}
          sx={props.styles?.slider}
        />
      </Grid>
    </Grid>
  );
};

export default BrightnessSlider;
