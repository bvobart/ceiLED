import { useContext } from 'react';
import { CeiledContext } from './CeiledContext';

const useCeiledSocket = () => useContext(CeiledContext);
export default useCeiledSocket;
