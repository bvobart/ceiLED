import { useEffect, useState, useCallback } from 'react';
import { Events } from '../api';
import useCeiledSocket from './context/useCeiledSocket';
import { ErrorMessage } from '../api/responses';

const useCeiledErrors = (): [ErrorMessage | null, () => void] => {
  const [socket] = useCeiledSocket();
  const [error, setError] = useState<ErrorMessage | null>(null);

  useEffect(() => {
    if (socket) {
      socket.on(Events.ERRORS, (error: ErrorMessage) => setError(error));
    }
  }, [socket]);

  const dismiss = useCallback(() => setError(null), []);
  return [error, dismiss];
}

export default useCeiledErrors;
