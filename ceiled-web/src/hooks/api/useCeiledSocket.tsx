import { useContext } from 'react';
import { CeiledContext } from '../context/CeiledContext';

/**
 * Returns true iff the socket exists and is connected.
 * @param socket the socket
 */
export const isConnected = (socket: SocketIOClient.Socket | null): socket is SocketIOClient.Socket => 
  socket ? socket.connected : false;

const useCeiledSocket = () => useContext(CeiledContext);
export default useCeiledSocket;
