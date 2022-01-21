import createCache from '@emotion/cache';
import { CacheProvider, EmotionCache } from '@emotion/react';
import { CssBaseline } from '@mui/material';
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import Script from 'next/script';
import '../styles/highlightjs.css';
import '../styles/index.css';
import { theme } from '../styles/theme';

// Client-side cache, shared for the whole session of the user in the browser.
// prepend: true moves MUI styles to the top of the <head> so they're loaded first.
// It allows developers to easily override MUI styles with other styling solutions, like CSS modules.
const clientSideEmotionCache = createCache({ key: 'css', prepend: true });

interface CeiledAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

function CeiledApp({ Component, emotionCache = clientSideEmotionCache, pageProps }: CeiledAppProps) {
  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name='viewport' content='initial-scale=1, width=device-width' />
      </Head>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          {/* Runtime environment variables from react-env */}
          <Script src='/__ENV.js' strategy='beforeInteractive' />
          <CssBaseline />
          <Component {...pageProps} />
        </ThemeProvider>
      </StyledEngineProvider>
    </CacheProvider>
  );
}

export default CeiledApp;
