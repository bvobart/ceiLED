import { useContext } from 'react';
import { CeiledContext } from '../context/CeiledContext';

const useCeiledSocket = () => useContext(CeiledContext);
export default useCeiledSocket;
