import React, { Component } from 'react';

export const ControllerSocketContext = React.createContext();

class ControllerSocketProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      enabled: false,
      address: null,
      socket: null,
      enable: () => this.setState({ enabled: true }),
      disable: () => this.setState({ enabled: false }),
      close: this.close.bind(this),
      open: this.open.bind(this),
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
   * Opens a websocket connection to controller at the specified address. 
   * Closes the existing connection, if there is one.
   * @param {String} address
   */
  open(address) {
    this.close();
    this.setState({
      socket: new WebSocket(address),
      address: address
    });
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
    if (this.state.socket && this.state.socket.readyState === 1) {
      this.state.socket.send(message);
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
