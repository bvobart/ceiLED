import { RGBColor, isRGBList, IRGBColor } from "../components/color-picking/colors";

export enum PatternType {
  SOLID = 'solid',
  FADE_LINEAR = 'fade-linear',
  FADE_SIGMOID = 'fade-sigmoid',
}

export interface IPattern {
  type: PatternType;
  length: number;
}

export interface Pattern extends IPattern {
  toCSS(): string;
}

export type Animation = Pattern[]

export const isPattern = (x: any): x is IPattern => {
  return Object.values(PatternType).includes(x.type) && typeof x.length === 'number';
};

export const isPatternArray = (x: any): x is IPattern[] => {
  if (Array.isArray(x)) {
    return !x.some(p => !isPattern(p));
  }
  return false;
};

export const decodePattern = (p: any): Pattern => {
  if (!Object.values(PatternType).includes(p.type)) {
    throw new Error(`Invalid pattern type: ${p.type}`);
  }

  if (typeof p.length !== 'number') {
    throw new Error(`Invalid pattern length: not a number: ${p.length}`)
  }

  if (p.type === PatternType.SOLID) {
    if (RGBColor.is(p.color)) {
      return new SolidPattern(p.length, new RGBColor(p.color));
    } else {
      throw new Error(`Invalid solid pattern: Invalid color: ${JSON.stringify(p.color)}`);
    }
  } 

  if (p.type === PatternType.FADE_LINEAR || p.type === PatternType.FADE_SIGMOID) {
    if (isRGBList(p.colors)) {
      return new FadePattern(p.type, p.length, p.colors.map((c: IRGBColor) => new RGBColor(c)));
    } else {
      throw new Error(`Invalid fade pattern: invalid colors: ${JSON.stringify(p.colors)}`);
    }
  }

  // TODO: MoodPattern

  throw new Error('invalid pattern: ' + JSON.stringify(p));
}

export const decodeAnimation = (ps: IPattern[]): Animation => {
  return ps.map(decodePattern);
}

export const decodePatternOrAnimation = (value: any): Pattern | Animation => {
  if (isPatternArray(value)) return decodeAnimation(value);
  else return decodePattern(value);
}

export class SolidPattern implements Pattern {
  type: PatternType.SOLID = PatternType.SOLID;
  length: number;
  color: RGBColor;

  constructor(length: number, color: RGBColor) {
    this.length = length;
    this.color = color;
  }

  toCSS(): string {
    return this.color.toCSS();
  }

  static is(p: any): p is SolidPattern {
    return p.type === PatternType.SOLID && typeof p.length === 'number' && RGBColor.is(p.color);
  }
}

export class FadePattern implements Pattern {
  type: PatternType.FADE_LINEAR | PatternType.FADE_SIGMOID;
  length: number;
  colors: RGBColor[];

  constructor(type: PatternType.FADE_LINEAR | PatternType.FADE_SIGMOID, length: number, colors: RGBColor[]) {
    this.type = type;
    this.length = length;
    this.colors = colors;
  }

  toCSS(direction?: string): string {
    if (this.colors.length === 0) return '';
    if (this.colors.length === 1) return this.colors[0].toCSS();

    const colorsCSS = this.colors.reduce((result: string, color: RGBColor, index) => {
      const percent = (index / (this.colors.length - 1)) * 100;
      const optionalComma = index + 1 !== this.colors.length ? ', ' : '';
      return result + color.toCSS() + ' ' + percent + '%' + optionalComma;
    }, '');

    if (direction) {
      return `linear-gradient(${direction}, ${colorsCSS})`
    }
    return `linear-gradient(${colorsCSS})`
  }

  static is(p: any): p is FadePattern {
    return (p.type === PatternType.FADE_LINEAR || p.type === PatternType.FADE_SIGMOID)
      && typeof p.length === 'number'
      && isRGBList(p.colors);
  }
}

// TODO: MoodPattern
