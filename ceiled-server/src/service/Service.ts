import Pattern from '../patterns/Pattern';

export interface Service {
  getBrightness(): Promise<number>;
  setBrightness(brightness: number): Promise<void>;

  getRoomlight(): Promise<number>;
  setRoomlight(roomlight: number): Promise<void>;

  getFlux(): Promise<number>;
  setFlux(flux: number): Promise<void>;

  off(): Promise<void>;
  getPattern(channel: number): Promise<Pattern>;
  setPattern(channel: number | 'all', pattern: Pattern): Promise<void>;
  setMultiplePatterns(patterns: Map<number, Pattern>): Promise<void>;
}
