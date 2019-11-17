import { HSVColor } from "../color-picking/colors";

export type Animation = Pattern[]

export interface Pattern {
  type: PatternType;
  length: number;
  toCSS(): string;
}

export enum PatternType {
  SOLID = 'solid',
  FADE_LINEAR = 'fade-linear',
  FADE_SIGMOID = 'fade-sigmoid',
}

export class Solid implements Pattern {
  type: PatternType.SOLID = PatternType.SOLID;
  color: HSVColor;
  length: number;

  constructor(color: HSVColor, length: number) {
    this.color = color;
    this.length = length;
  }

  toCSS(): string {
    return this.color.toCSS();
  }
}

export class FadeLinear implements Pattern {
  type: PatternType.FADE_LINEAR = PatternType.FADE_LINEAR;
  colors: HSVColor[];
  length: number;

  constructor(colors: HSVColor[], length: number) {
    this.colors = colors;
    this.length = length;
  }

  toCSS(direction?: string): string {
    if (this.colors.length === 0) return '';
    if (this.colors.length === 1) return this.colors[0].toCSS();

    const colorsCSS = this.colors.reduce((result: string, color: HSVColor, index) => {
      const percent = (index / (this.colors.length - 1)) * 100;
      const optionalComma = index + 1 !== this.colors.length ? ', ' : '';
      return result + color.toCSS() + ' ' + percent + '%' + optionalComma;
    }, '');

    if (direction) {
      return `linear-gradient(${direction}, ${colorsCSS})`
    }
    return `linear-gradient(${colorsCSS})`
  }
}

export class FadeSigmoid implements Pattern {
  type: PatternType.FADE_SIGMOID = PatternType.FADE_SIGMOID;

  colors: HSVColor[];
  length: number;

  constructor(colors: HSVColor[], length: number) {
    this.colors = colors;
    this.length = length;
  }

  toCSS(direction?: string): string {
    if (this.colors.length === 0) return '';
    if (this.colors.length === 1) return this.colors[0].toCSS();

    // TODO: make this display the gradient in more sigmoid fashion rather than linear
    const colorsCSS = this.colors.reduce((result: string, color: HSVColor, index) => {
      const percent = (index / (this.colors.length - 1)) * 100;
      const optionalComma = index + 1 !== this.colors.length ? ', ' : '';
      return result + color.toCSS() + ' ' + percent + '%' + optionalComma;
    }, '');

    if (direction) {
      return `linear-gradient(${direction}, ${colorsCSS})`
    }
    return `linear-gradient(${colorsCSS})`
  }
}
