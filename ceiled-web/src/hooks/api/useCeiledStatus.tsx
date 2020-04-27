import { useContext } from 'react';
import { StatusContext } from '../context/StatusContext';

const useCeiledStatus = () => useContext(StatusContext);
export default useCeiledStatus;
