import { useContext } from 'react';
import { Socket } from 'socket.io-client';
import { SocketContext } from '../context/SocketContext';

/**
 * Returns true iff the socket exists and is connected.
 * @param socket the socket
 */
export const isConnected = (socket: Socket | null): socket is Socket => (socket ? socket.connected : false);

const useCeiledSocket = () => useContext(SocketContext);
export default useCeiledSocket;
