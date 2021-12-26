import { isBrowser } from '../../config';

/**
 * The useAuthToken hook gives easy access to the authorisation token used to
 * authorise CeiLED requests, stored in local storage.
 */
const useAuthToken = (): string => {
  if (!isBrowser()) return '';

  const token = localStorage.getItem('authToken');
  if (!token || token === '') {
    const tokens = new Uint32Array(8);
    crypto.getRandomValues(tokens);
    const newAuthToken = tokens.reduce((token, current) => (token += current), '');
    localStorage.setItem('authToken', newAuthToken);

    return newAuthToken;
  }

  return token;
};

export default useAuthToken;
