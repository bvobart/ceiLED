import Color from '../../common/Color';
import Pattern from '../../patterns/Pattern';
import SolidPattern from '../../patterns/SolidPattern';

import FadePattern from '../../patterns/FadePattern';
import { FadePatternOptions } from '../../patterns/options/FadePatternOptions';
import { JumpPatternOptions } from '../../patterns/options/JumpPatternOptions';

/**
 * Types of requests that can be made. These are the supported patterns, described in the API
 * documentation as the pattern types.
 */
export enum CeiledRequestType {
  SOLID = 'solid',
  JUMP = 'jump',
  FADE = 'fade',
  FLASH = 'flash'
};

/**
 * Request to the CeiLED controller.
 */
export class CeiledRequest {

  /**
   * Returns true iff the given argument is a valid Request object.
   * Only checks whether the argument has the right attributes and the right attribute types.
   * It does not check whether the attributes contain the right values!
   * @param x the argument to check
   */
  public static isRequest(x: any): x is CeiledRequest {
    if (typeof x.type !== 'string' 
        || typeof x.brightness !== 'number' 
        || typeof x.roomLight !== 'number' 
        || !Array.isArray(x.colors)
    ) {
      return false;
    }
    
    if (!Object.values(CeiledRequestType).includes(x.type)) return false;
    if (x.colors.length === 0 || x.colors.find((value: any) => !Color.isColor(value))) return false;

    return true;
  }

  public type: CeiledRequestType;
  public brightness: number;
  public roomLight: number;
  public colors: Color[];
  public patternOptions: JumpPatternOptions | FadePatternOptions;

  constructor(
    type: CeiledRequestType,
    brightness: number,
    roomLight: number,
    colors: Color[],
    patternOptions?: any
  ) {
    this.type = type;
    this.brightness = brightness < 0 ? 0 : brightness > 100 ? 100 : brightness;
    this.roomLight = roomLight < 0 ? 0 : roomLight > 100 ? 100 : roomLight;
    // the colours that come in through the web socket have the attributes of Color, but not the methods.
    this.colors = colors.map(({ red, green, blue }: Color) => new Color({ red, green, blue }));
    switch (type) {
      case CeiledRequestType.FADE: 
        this.patternOptions = new FadePatternOptions(patternOptions);
        break;
      case CeiledRequestType.JUMP: 
        this.patternOptions = new JumpPatternOptions(patternOptions);
        break;
      default: break;
    }
  }

  /**
   * Constructs a Pattern instance from the details captured in the request.
   * May throw an error if the request contains incorrect data.
   */
  public toPattern(): Pattern {
    switch (this.type) {
      case CeiledRequestType.SOLID:
        return new SolidPattern(this.colors, this.brightness, this.roomLight);
      case CeiledRequestType.FADE:
        if (this.patternOptions instanceof FadePatternOptions)
          return new FadePattern(this.colors, this.brightness, this.roomLight, this.patternOptions)
        else throw new TypeError(`Wrong pattern options given, FadePatternOptions expected: ${JSON.stringify(this.patternOptions)}`);
      default:
        throw new TypeError('Unknown pattern type: ' + this.type);
    }
  }
}