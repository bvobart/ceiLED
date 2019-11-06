export interface Service {
  getBrightness(): Promise<number>;
  setBrightness(brightness: number): Promise<void>;

  getRoomlight(): Promise<number>;
  setRoomlight(roomlight: number): Promise<void>;

  getFlux(): Promise<number>;
  setFlux(flux: number): Promise<void>;

  // TODO: setting CeiLED patterns etc.
}
