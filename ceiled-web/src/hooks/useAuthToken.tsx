import { useState } from 'react';

/**
 * The useAuthToken hook gives easy access to the authorisation token used to
 * authorise CeiLED requests, stored in local storage.
 */
const useAuthToken = () => {
  const [token, setToken] = useState(localStorage.getItem('authToken'));

  if (!token || token === '') {
    const tokens = new Uint32Array(8);
    crypto.getRandomValues(tokens);
    const authToken = tokens.reduce((token, current) => token += current, '');
    localStorage.setItem('authToken', authToken);
    setToken(authToken);
  }

  return token;
}

export default useAuthToken;