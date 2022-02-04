import { Moods } from './moods';
import { Animation, Pattern } from './patterns';

export enum CeiledStatus {
  DISCONNECTED = 'disconnected',
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
  ERROR = 'error',
}

export enum Events {
  // System
  CONNECT = 'connect',
  CONNECT_ERROR = 'connect_error',
  CONNECT_TIMEOUT = 'connect_timeout',
  DISCONNECT = 'disconnect',
  // CeiLED
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
