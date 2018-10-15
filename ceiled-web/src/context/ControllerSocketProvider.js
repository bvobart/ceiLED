import React, { Component } from 'react';

export const ControllerSocketContext = React.createContext();

class ControllerSocketProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      address: null,
      socket: null,

      brightness: 0,
      roomLight: 0,
      setBrightness: (brightness) => this.setState({ brightness }),
      setRoomLight: (roomLight) => this.setState({ roomLight }),
      
      open: this.open.bind(this),
      close: this.close.bind(this),
      getStatus: this.getStatus.bind(this),
      reconnect: this.reconnect.bind(this),
      send: this.send.bind(this)
    }
  }

  /**
   * Closes the WebSocket, if there is one.
   */
  close() {
    if (this.state.socket) {
      this.state.socket.close();
    }
  }
  
  /**
   * Returns the current status of the socket connection to the controller.
   * Returns one of WebSocket.OPEN, WebSocket.CLOSED etc.
   */
  getStatus() {
    if (!this.state.socket) return WebSocket.CLOSED;
    else return this.state.socket.readyState;
  }

  /**
   * Opens a websocket connection to controller at the specified address. 
   * Closes the existing connection, if there is one.
   * @param {String} address
   */
  open(address) {
    return new Promise((resolve, reject) => {
      const newSocket = new WebSocket(address);
      newSocket.addEventListener('open', () => resolve());
      newSocket.addEventListener('error', (event) => reject(event));
      
      this.close();
      this.setState({
        socket: new WebSocket(address),
        address: address
      });
    })
  }

  /**
   * Reconnects the WebSocket to the address it was previously connected to.
   */
  reconnect() {
    if (!this.state.address) console.error('Address is null, cannot reconnect!');
    else this.open(this.state.address); 
  }

  /**
   * Sends a message through the WebSocket to the controller.
   * @param {String} message The message to be sent 
   */
  send(message) {
    if (this.state.socket && this.state.socket.readyState === WebSocket.OPEN) {
      this.state.socket.send(typeof message === 'string' ? message : JSON.stringify(message));
    } else {
      console.error('Socket not connected!');
    }
  }


  render() {
    return (
      <ControllerSocketContext.Provider value={this.state}>
        {this.props.children}
      </ControllerSocketContext.Provider>
    )
  }
}

export default ControllerSocketProvider;
