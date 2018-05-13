import Color from "../../common/Color";

export enum FadeType {
  NORMAL = 'normal',
  INVERTED = 'inverted',
  LINE = 'line',
  REVERSE_LINE = 'reverse-line'
}

export class FadePatternOptions {
  public speed: number;
  public channels: number;
  public colors2?: Color[];
  public colors3?: Color[];
  public fadeType: FadeType;

  constructor(
    speed: number, 
    channels: number, 
    colors2: Color[], 
    colors3: Color[], 
    fadeType: FadeType
  ) {
    this.speed = speed;
    this.channels = channels;
    this.colors2 = colors2;
    this.colors3 = colors3;
    this.fadeType = fadeType;
  }
}