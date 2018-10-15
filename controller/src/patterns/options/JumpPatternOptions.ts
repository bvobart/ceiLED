import Color from "../../common/Color";

export enum JumpType {
  NORMAL = 'normal',
  LINE = 'line',
  REVERSE_LINE = 'reverse-line'
}

export interface IJumpPatternOptions {
  speed: number;
  channels: number;
  colors2: Color[];
  colors3: Color[];
  jumpType: JumpType;
}

export class JumpPatternOptions implements IJumpPatternOptions {
  public speed: number;
  public channels: number;
  public colors2: Color[];
  public colors3: Color[];
  public jumpType: JumpType;

  constructor({
    speed, 
    channels, 
    colors2, 
    colors3, 
    jumpType
  }: IJumpPatternOptions) {
    this.speed = speed;
    this.channels = channels;
    this.colors2 = colors2.map(({ red, green, blue }: Color) => new Color({ red, green, blue }));
    this.colors3 = colors3.map(({ red, green, blue }: Color) => new Color({ red, green, blue }));
    this.jumpType = jumpType;
  }

  // private isJumpPatternOptions(options: any): options is JumpPatternOptions {
  //   /* tslint:disable:curly */
  //   if (typeof options.speed !== 'number') 
  //     throw new TypeError('options.speed should be a number');
  //   if (typeof options.channels !== 'number') 
  //     throw new TypeError('options.channels should be a number');
  //   if (typeof options.colors2 !== 'array')
  //     throw new TypeError('options.colors2 should be an array');
  //   if (typeof options.colors3 !== 'array')
  //     throw new TypeError('options.colors3 should be an array');
  //   if (typeof options.jumpType !== 'string' || !Object.values(JumpType).includes(options.jumpType))
  //     throw new TypeError('options.jumpType should be a value from JumpType');
  // }
}