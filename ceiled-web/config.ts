import env from '@beam-australia/react-env';

export const isBrowser = (): boolean => typeof window !== 'undefined';

export class Config {
  get serverAddress() {
    return env('API_ADDRESS') || `api.${isBrowser() ? window.location.host : 'unknown'}`;
  }
}

export default new Config();
