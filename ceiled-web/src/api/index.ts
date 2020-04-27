import { Animation, Pattern } from "./patterns";
import { Moods } from './moods';

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
  ERRORS = 'errors',
  BRIGHTNESS = 'brightness',
  ROOMLIGHT = 'roomlight',
  FLUX = 'flux',
  CEILED = 'ceiled',
  SPEED = 'speed',
}

// TODO: possibly make all CeiledAPI method return some form of error object if there is a client-side error in sending the request (e.g. not connected)
export interface CeiledAPI {
  getPattern(channel: number | 'all'): Promise<void>;
  setPattern(channel: number | 'all', pattern: Pattern): Promise<void>;
  setPatterns(patterns: Map<number, Pattern>): Promise<void>;
  setAnimations(animations: Map<number, Animation>): Promise<void>;
  setMood(mood: Moods): Promise<void>;
}

export type CeiledState = Map<number, Pattern | Animation>;
