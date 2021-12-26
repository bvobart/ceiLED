import { ThemeProvider } from '@material-ui/styles';
import type { AppProps } from 'next/app';
import Script from 'next/script';
import '../styles/highlightjs.css';
import '../styles/index.css';
import { theme } from '../styles/theme';

function CeiledApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      {/* Runtime environment variables from react-env */}
      <Script src='/__ENV.js' strategy='beforeInteractive' />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default CeiledApp;
