import React, { Component } from 'react';
import { withCookies } from 'react-cookie';
import CeiledRequestBuilder from './CeiledRequestBuilder';

export const ControllerSocketContext = React.createContext();

class ControllerSocketProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      address: null,
      socket: null,
      connected: false,

      open: this.open.bind(this),
      close: this.close.bind(this),
      getStatus: this.getStatus.bind(this),
      reconnect: this.reconnect.bind(this),
      send: this.send.bind(this),
      turnOff: this.turnOff.bind(this)
    }
  }

  /**
   * Closes the WebSocket, if there is one.
   */
  close() {
    if (this.state.socket) {
      this.state.socket.close();
      this.setState({ connected: false });
    }
  }

  /**
   * Turns the lights to black and closes the connection to the controller. Good night ;)
   */
  turnOff() {
    if (this.state.socket) {
      this.send(new CeiledRequestBuilder()
        .setType('solid')
        .setColors([{ red: 0, green: 0, blue: 0 }])
        .setAuthToken(this.props.cookies.get('authToken'))
      );
      this.close();
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
      newSocket.addEventListener('open', () => {
        this.setState({ connected: true });
        return resolve();
      });
      // TODO: add event listener for unauthorised messages, so we can show a pop up or header stating this
      newSocket.addEventListener('message', (event) => console.log(JSON.parse(event.data)));
      newSocket.addEventListener('error', (event) => reject(event));
      
      this.close();
      this.setState({
        socket: newSocket,
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

export default withCookies(ControllerSocketProvider);
