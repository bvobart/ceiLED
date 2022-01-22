import { InternalStandardProps } from '@mui/material';
import { createStyled, shouldForwardProp } from '@mui/system';
import * as React from 'react';
import { theme } from '../../../styles/theme';

// Taken and adapted from https://github.com/mui-org/material-ui/blob/master/packages/mui-material/src/OutlinedInput/NotchedOutline.js

const rootShouldForwardProp = (prop: PropertyKey) => shouldForwardProp(prop) && prop !== 'classes';
const styled = createStyled({ defaultTheme: theme, rootShouldForwardProp });

const NotchedOutlineRoot = styled('fieldset')({
  textAlign: 'left',
  position: 'absolute',
  bottom: 0,
  right: 0,
  top: -5,
  left: 0,
  margin: 0,
  padding: '0 8px',
  pointerEvents: 'none',
  borderRadius: 'inherit',
  borderStyle: 'solid',
  borderWidth: 1,
  overflow: 'hidden',
  minWidth: '0%',
});

const NotchedOutlineLegend = styled('legend', { skipSx: true })(props => {
  const ownerState = (props as any).ownerState;
  const theme = props.theme;
  return {
    float: 'unset', // Fix conflict with bootstrap
    ...(ownerState.label === undefined && {
      padding: 0,
      lineHeight: '11px', // sync with `height` in `legend` styles
      transition: theme.transitions.create('width', {
        duration: 150,
        easing: theme.transitions.easing.easeOut,
      }),
    }),
    ...(ownerState.label !== undefined && {
      display: 'block', // Fix conflict with normalize.css and sanitize.css
      width: 'auto', // Fix conflict with bootstrap
      padding: 0,
      height: 11, // sync with `lineHeight` in `legend` styles
      fontSize: '0.75em',
      visibility: 'hidden',
      maxWidth: 0.01,
      transition: theme.transitions.create('max-width', {
        duration: 50,
        easing: theme.transitions.easing.easeOut,
      }),
      whiteSpace: 'nowrap',
      '& > span': {
        paddingLeft: 5,
        paddingRight: 5,
        display: 'inline-block',
      },
      ...(ownerState.notched && {
        maxWidth: '100%',
        transition: theme.transitions.create('max-width', {
          duration: 100,
          easing: theme.transitions.easing.easeOut,
          delay: 50,
        }),
      }),
    }),
  };
});

export interface NotchedOutlineProps extends InternalStandardProps<React.FieldsetHTMLAttributes<HTMLFieldSetElement>> {
  disabled?: boolean;
  error?: boolean;
  focused?: boolean;
  label?: React.ReactNode;
  notched: boolean;
}

export type NotchedOutlineLegendProps = NotchedOutlineProps;

const NotchedOutline = (props: NotchedOutlineProps) => {
  const { className, label, notched, ...other } = props;
  const ownerState: NotchedOutlineProps = {
    ...props,
    notched,
    label,
  };

  return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore I'm gonna trust MaterialUI for implementing this correctly
    <NotchedOutlineRoot aria-hidden className={className} ownerState={ownerState} {...other}>
      {/* //
       // @ts-ignore */}
      <NotchedOutlineLegend ownerState={ownerState}>
        {/* Use the nominal use case of the legend, avoid rendering artefacts. */}
        {label ? (
          <span>{label}</span>
        ) : (
          // notranslate needed while Google Translate will not fix zero-width space issue
          // eslint-disable-next-line react/no-danger
          <span className='notranslate' dangerouslySetInnerHTML={{ __html: '&#8203;' }} />
        )}
      </NotchedOutlineLegend>
    </NotchedOutlineRoot>
  );
};

export default NotchedOutline;
