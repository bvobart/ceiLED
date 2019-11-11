export enum CeiledStatus {
  DISCONNECTED = 'disconnected',
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
  TIMEOUT = 'timeout',
}

export enum Events {
  CONNECT = 'connect',
  CONNECT_TIMEOUT = 'connect_timeout',
  RECONNECT_FAILED = 'reconnect_failed',
  DISCONNECT = 'disconnect',
  BRIGHTNESS = 'brightness',
  ERRORS = 'errors',
}
