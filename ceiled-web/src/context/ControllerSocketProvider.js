import throttle from 'lodash.throttle';
import React, { Component } from 'react';
import { withCookies } from 'react-cookie';
import CeiledRequestBuilder from './CeiledRequestBuilder';
import UnauthorisedDialog from './UnauthorisedDialog';
import ErrorDialog from './ErrorDialog';

export const ControllerSocketContext = React.createContext();

class ControllerSocketProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      address: null,
      socket: null,
      connected: false,
      status: WebSocket.CLOSED,
      unauthorised: false,
      gotError: false,
      lastAlive: null,

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
      this.setState({ connected: false, status: WebSocket.CLOSED });
    }
  }

  /**
   * Turns the lights to black and closes the connection to the controller. Good night ;)
   */
  turnOff() {
    if (this.state.socket) {
      const offRequest = new CeiledRequestBuilder()
        .setType('off')
        .setAuthToken(this.props.cookies.get('authToken'))
        .build();
      this.send(offRequest);
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
        this.setState({ connected: true, lastAlive: Date.now(), status: WebSocket.OPEN });
        return resolve();
      });
      newSocket.addEventListener('message', (event) => this.handleReply(event.data));
      newSocket.addEventListener('error', (event) => reject(event));
      newSocket.addEventListener('close', () => {
        this.setState({ connected: false, status: WebSocket.CLOSED })
        console.log('Connection to server closed');
      });
      
      this.close();
      this.setState({
        socket: newSocket,
        address: address,
        status: WebSocket.CONNECTING,
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
    const { address, connected, lastAlive, socket } = this.state;
    if (socket && socket.readyState === WebSocket.OPEN) {
      // after 60 seconds of no activity, reconnect to the server before sending message
      if (lastAlive && !connected && Date.now() - lastAlive > 60000) {
        this.open(address)
          .then(() => {
            this.setState({ lastAlive: Date.now() });
            socket.send(typeof message === 'string' ? message : JSON.stringify(message));
          })
          .catch(err => console.error('Failed to send message even after reopening socket: ', err))
      } else {
        socket.send(typeof message === 'string' ? message : JSON.stringify(message));
      }
    } else {
      console.error('Socket not connected!');
    }
  }

  handleReply(data) {
    const message = JSON.parse(data);
    console.log('Received message from server: ', message);
    throttle(() => this.setState({ lastAlive: Date.now() }), 1000);

    if (message.status === 'unauthorised') this.setState({ unauthorised: true });
    if (message.status === 'closing') this.close();
    if (message.status === 'error') {
      this.errors = message.errors;
      this.setState({ gotError: true });
    }
  }

  render() {
    return (
      <ControllerSocketContext.Provider value={this.state}>
        {this.props.children}
        <UnauthorisedDialog open={this.state.unauthorised} onClose={() => this.setState({ unauthorised: false })} />
        <ErrorDialog errors={this.errors} open={this.state.gotError} onClose={() => this.setState({ gotError: false })} />
      </ControllerSocketContext.Provider>
    )
  }
}

export default withCookies(ControllerSocketProvider);
