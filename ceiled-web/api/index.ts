import { Animation, Pattern } from './patterns';
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

export interface CeiledAPI {
  getPattern(channel: number | 'all'): CeiledStatus;
  setPattern(channel: number | 'all', pattern: Pattern): CeiledStatus;
  setPatterns(patterns: Map<number, Pattern>): CeiledStatus;
  setAnimations(animations: Map<number, Animation>): CeiledStatus;
  setMood(mood: Moods): CeiledStatus;
}

export type CeiledState = Map<number, Pattern | Animation>;
