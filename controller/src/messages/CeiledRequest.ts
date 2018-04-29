import Color from '../common/Color';
import Pattern from '../patterns/Pattern';
import SolidPattern from '../patterns/SolidPattern';

import { FadePatternOptions } from '../patterns/options/FadePatternOptions';
import { JumpPatternOptions } from '../patterns/options/JumpPatternOptions';

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
   * @param x the argument to check
   */
  public static isRequest(x: any): x is Request {
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
    patternOptions?: JumpPatternOptions | FadePatternOptions
  ) {
    this.type = type;
    this.brightness = brightness;
    this.roomLight = roomLight;
    this.colors = colors;
    this.patternOptions = patternOptions;
  }

  /**
   * Constructs a Pattern instance from the details captured in the request.
   * May throw an error if the request contains incorrect data.
   */
  public toPattern(): Pattern {
    switch (this.type) {
      case CeiledRequestType.SOLID:
        return new SolidPattern(this.colors, this.brightness, this.roomLight);
      default:
        throw new TypeError('Unknown pattern type: ' + this.type);
    }
  }
}