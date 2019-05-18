import Color from '../../common/Color';

export enum FadeType {
  NORMAL = 'normal',
  INVERTED = 'inverted',
  LINE = 'line',
  REVERSE_LINE = 'reverse-line',
}

export enum InterpolationType {
  LINEAR = 'linear',
  SIGMOID = 'sigmoid',
}

export interface IFadePatternOptions {
  speed: number;
  channels: number;
  colors2?: Color[];
  colors3?: Color[];
  fadeType: FadeType;
  interpolation: InterpolationType;
}

export class FadePatternOptions implements IFadePatternOptions {
  public speed: number;
  public channels: number;
  public colors2?: Color[];
  public colors3?: Color[];
  public fadeType: FadeType;
  public interpolation: InterpolationType;

  constructor({ speed, channels, colors2, colors3, fadeType, interpolation }: IFadePatternOptions) {
    this.speed = speed;
    this.channels = channels;
    this.colors2 = colors2 ? colors2 : [];
    this.colors3 = colors3 ? colors3 : [];
    this.fadeType = fadeType;
    this.interpolation = interpolation;

    this.colors2.map(({ red, green, blue }: Color) => new Color({ red, green, blue }));
    this.colors3.map(({ red, green, blue }: Color) => new Color({ red, green, blue }));
  }
}
