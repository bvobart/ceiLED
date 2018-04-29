import Color from '../common/Color';
import Pattern from './Pattern';

class SolidPattern implements Pattern {
  private colors: Color[];
  private brightness: number;
  private roomLight: number;

  constructor(colors: Color[], brightness: number, roomLight: number) {
    this.colors = colors;
    this.brightness = brightness;
    this.roomLight = roomLight;
  }

  public show(): void {
    // actually show pattern.
    console.log("Show solid pattern!");
  }

  public stop(): void {
    // won't'need to do anything
    console.log("Stop solid pattern");
  }
}

export default SolidPattern;
