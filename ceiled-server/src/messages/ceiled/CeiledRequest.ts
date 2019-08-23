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
  OFF = 'off',
  SOLID = 'solid',
  JUMP = 'jump',
  FADE = 'fade',
  FLASH = 'flash',
}

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
    if (typeof x.type !== 'string' || !Array.isArray(x.colors)) {
      return false;
    }

    if (!Object.values(CeiledRequestType).includes(x.type)) return false;
    if (x.colors.find((value: any) => !Color.isColor(value))) return false;

    return true;
  }

  public type: CeiledRequestType;
  public colors: Color[];
  public patternOptions: JumpPatternOptions | FadePatternOptions;

  constructor(type: CeiledRequestType, colors: Color[], patternOptions?: any) {
    this.type = type;
    // the colours that come in through the web socket have the attributes of Color, but not the methods.
    this.colors = colors.map(asColor);
    if (patternOptions && patternOptions.colors2 instanceof Array) {
      patternOptions.colors2 = patternOptions.colors2.map(asColor);
    }
    if (patternOptions && patternOptions.colors3 instanceof Array) {
      patternOptions.colors3 = patternOptions.colors3.map(asColor);
    }

    switch (type) {
      case CeiledRequestType.FADE:
        this.patternOptions = new FadePatternOptions(patternOptions);
        break;
      case CeiledRequestType.JUMP:
        this.patternOptions = new JumpPatternOptions(patternOptions);
        break;
      default:
        break;
    }
  }

  /**
   * Constructs a Pattern instance from the details captured in the request.
   * May throw an error if the request contains incorrect data.
   */
  public toPattern(): Pattern {
    switch (this.type) {
      case CeiledRequestType.OFF:
        return new SolidPattern([]);
      case CeiledRequestType.SOLID:
        return new SolidPattern(this.colors);
      case CeiledRequestType.FADE:
        if (this.patternOptions instanceof FadePatternOptions)
          return new FadePattern(this.colors, this.patternOptions);
        else
          throw new TypeError(
            `Wrong pattern options given, FadePatternOptions expected: ${JSON.stringify(
              this.patternOptions,
            )}`,
          );
      default:
        throw new TypeError('Unknown pattern type: ' + this.type);
    }
  }
}

// Transforms an object with the shape of a Color object to an actual Color object.
const asColor = ({ red, green, blue }: Color) => new Color({ red, green, blue });
