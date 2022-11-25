import type { SxProps, Theme } from '@mui/material';
import { Grid, Slider, Typography } from '@mui/material';
import useFlux from '../../hooks/api/useFlux';

interface FluxSliderProps {
  className?: string;
  styles?: {
    slider: SxProps<Theme>;
  };
}

const FluxSlider = (props: FluxSliderProps): JSX.Element => {
  const [flux, setFlux] = useFlux();

  return (
    <Grid
      container
      item
      className={props.className}
      alignItems='center'
      justifyContent='space-between'
      py={{ xs: 0, sm: 1 }}
    >
      <Grid container item xs={6} sm={2} alignItems='center' justifyContent='space-between'>
        <Grid item xs={4} sm={1}>
          <Typography variant='caption'>Flux</Typography>
        </Grid>
        <Grid item xs={2} sm={1}>
          <Typography variant='caption'>{flux === -1 ? 'Auto' : flux}</Typography>
        </Grid>
      </Grid>
      <Grid item xs={12} sm={9}>
        <Slider
          value={flux}
          onChange={(_, newFlux) => newFlux !== flux && setFlux(newFlux as number)}
          min={-1}
          max={5}
          step={1}
          sx={props.styles?.slider}
        />
      </Grid>
    </Grid>
  );
};

export default FluxSlider;
