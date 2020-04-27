import { Moods } from '../moods';
import { Animation } from '../patterns/Animation';
import { Pattern } from '../patterns/Pattern';

export interface Service {
  getBrightness(): Promise<number>;
  setBrightness(brightness: number): Promise<void>;

  getRoomlight(): Promise<number>;
  setRoomlight(roomlight: number): Promise<void>;

  getFlux(): Promise<number>;
  setFlux(flux: number): Promise<void>;

  off(): Promise<void>;
  getPattern(channel: number): Promise<Pattern | undefined>;
  getPatterns(): Promise<Map<number, Pattern>>;
  setPattern(channel: number | 'all', pattern: Pattern): Promise<void>;
  setPatterns(patterns: Map<number, Pattern>): Promise<void>;
  setAnimations(animations: Map<number, Animation>): Promise<void>;
  setMood(mood: Moods): Promise<void>;

  getSpeed(): Promise<number>;
  setSpeed(speed: number): Promise<void>;
}
