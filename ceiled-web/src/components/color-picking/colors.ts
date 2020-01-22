export interface IHSVColor {
  h: number;
  s: number;
  v: number;
}

export interface IRGBColor {
  red: number;
  green: number;
  blue: number;  
}

/**
 * HSVColor defines a colour by its Hue, Saturation and Value properties, go look that up on Wikipedia if you're unfamiliar.
 * The `h`, `s` and `v` values are assumed to be between 0 and 1.
 */
export class HSVColor implements IHSVColor {
  h: number;
  s: number;
  v: number;

  constructor({ h, s, v }: IHSVColor) {
    this.h = h;
    this.s = s;
    this.v = v;
  }

  equals(other: HSVColor): boolean {
    return this.toRGB().equals(other.toRGB());
  }

  toCSS(): string {
    return this.toRGB().toCSS();
  }

  /**
   * Converts an HSV colour to RGB. If the `h`, `s` and `v` values are indeed between 0 and 1, then this will
   * produce the corresponding RGB colour with integer values between 0 and 255.
   * Code taken from https://stackoverflow.com/questions/17242144/javascript-convert-hsb-hsv-color-to-rgb-accurately
   */
  toRGB(): RGBColor {
    const i = Math.floor(this.h * 6);
    const f = this.h * 6 - i;
    const p = this.v * (1 - this.s);
    const q = this.v * (1 - f * this.s);
    const t = this.v * (1 - (1 - f) * this.s);
    
    let r = 0;
    let g = 0;
    let b = 0;
    switch (i % 6) {
      case 0: r = this.v; g = t; b = p; break;
      case 1: r = q; g = this.v; b = p; break;
      case 2: r = p; g = this.v; b = t; break;
      case 3: r = p; g = q; b = this.v; break;
      case 4: r = t; g = p; b = this.v; break;
      case 5: r = this.v; g = p; b = q; break;
    }

    return new RGBColor({
      red: Math.round(r * 255),
      green: Math.round(g * 255),
      blue: Math.round(b * 255),
    });
  }

  static random(): HSVColor {
    return new HSVColor({ h: Math.random(), s: Math.random(), v: Math.random() });
  }

  static is(c: any): c is IHSVColor {
    return c && typeof c.h === 'number' && typeof c.s === 'number' && typeof c.v === 'number'
             && c.h >= 0 && c.h <= 1 
             && c.s >= 0 && c.s <= 1 
             && c.v >= 0 && c.v <= 1;
  }
}

/**
 * RGBColor defines a colour by its red, green and blue components.
 */
export class RGBColor implements IRGBColor {
  red: number;
  green: number;
  blue: number;

  constructor({ red, green, blue }: IRGBColor) {
    this.red = red;
    this.green = green;
    this.blue = blue;
  }

  equals(other: RGBColor): boolean {
    return this.red === other.red && this.green === other.green && this.blue === other.blue;
  }

  toCSS(): string {
    return `rgb(${this.red}, ${this.green}, ${this.blue})`
  }

  /**
   * Converts an RGB colour to HSV.
   * Code inspired by https://stackoverflow.com/questions/17242144/javascript-convert-hsb-hsv-color-to-rgb-accurately
   */
  toHSV(): HSVColor {
    const max = Math.max(this.red, this.green, this.blue);
    const min = Math.min(this.red, this.green, this.blue);
    const d = max - min;

    let h = 0;
    const s = (max === 0 ? 0 : d / max);
    const v = max / 255;

    switch (max) {
        case min: h = 0; break;
        case this.red: h = (this.green - this.blue) + d * (this.green < this.blue ? 6 : 0); h /= 6 * d; break;
        case this.green: h = (this.blue - this.red) + d * 2; h /= 6 * d; break;
        case this.blue: h = (this.red - this.green) + d * 4; h /= 6 * d; break;
    }

    return new HSVColor({ h: h, s: s, v: v });
  }

  static is(c: any): c is IRGBColor {
    return c && typeof c.red === 'number' && typeof c.green === 'number' && typeof c.blue === 'number'
             && c.red >= 0 && c.red <= 255 
             && c.green >= 0 && c.green <= 255 
             && c.blue >= 0 && c.blue <= 255;
  }
}

export const isHSVList = (x: any): x is IHSVColor[] => {
  return Array.isArray(x) && !x.find(c => !HSVColor.is(c));
}

export const isRGBList = (x: any): x is IRGBColor[] => {
  return Array.isArray(x) && !x.find(c => !RGBColor.is(c));
}
