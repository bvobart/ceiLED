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

export interface IHSLColor {
  h: number;
  s: number;
  l: number;
}

/**
 * HSVColor defines a colour by its Hue, Saturation and Value properties, go look that up on Wikipedia if you're unfamiliar.
 * The `h`, `s` and `v` values are assumed to be between 0 and 1.
 */
export class HSVColor implements IHSVColor {
  public static BLACK = new HSVColor({ h: 0, s: 0, v: 0 });
  public static WHITE = new HSVColor({ h: 0, s: 0, v: 1 });

  static grey(value: number): HSVColor {
    return new HSVColor({ h: 0, s: 0, v: value });
  }

  static random(): HSVColor {
    return new HSVColor({ h: Math.random(), s: Math.random(), v: Math.random() });
  }

  static is(c: any): c is IHSVColor {
    return c && typeof c.h === 'number' && typeof c.s === 'number' && typeof c.v === 'number' // eslint-disable-line prettier/prettier
             && c.h >= 0 && c.h <= 1  // eslint-disable-line prettier/prettier
             && c.s >= 0 && c.s <= 1  // eslint-disable-line prettier/prettier
             && c.v >= 0 && c.v <= 1; // eslint-disable-line prettier/prettier
  }

  // --------------------------------------------------

  h: number;
  s: number;
  v: number;

  constructor(color?: IHSVColor) {
    this.h = color?.h || 0;
    this.s = color?.s || 0;
    this.v = color?.v || 0;
  }

  equals(other: HSVColor): boolean {
    return this.toRGB().equals(other.toRGB());
  }

  toCSS(alpha?: number): string {
    return this.toHSL().toCSS(alpha);
  }

  /**
   * Returns whether text that is rendered on top of this colour should be 'black' or 'white' in order to be readable.
   * Basically, darker colours will have white text color, whereas lighter colours will get black text colour.
   * Sourced from: https://stackoverflow.com/questions/1855884/determine-font-color-based-on-background-color
   */
  textCSS(): string {
    const { red, green, blue } = this.toRGB();
    const luma = (0.299 * red + 0.587 * green + 0.114 * blue) / 255;
    return luma > 0.5 ? 'black' : 'white';
  }

  /**
   * Converts an HSV colour to HSL. All HSV and HSL components will be within 0 and 1.
   * Code inspired by: https://stackoverflow.com/questions/3423214/convert-hsb-hsv-color-to-hsl
   */
  toHSL(): HSLColor {
    const lum = ((2 - this.s) * this.v) / 2;

    const sat = ((lum: number): number => {
      if (lum === 0) return this.s;
      if (lum === 1) return 0;
      if (lum < 0.5) return (this.s * this.v) / (lum * 2);
      return (this.s * this.v) / (2 - lum * 2);
    })(lum);

    return new HSLColor({ h: this.h, s: sat, l: lum });
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
      case 0: r = this.v; g = t; b = p; break; // eslint-disable-line prettier/prettier
      case 1: r = q; g = this.v; b = p; break; // eslint-disable-line prettier/prettier
      case 2: r = p; g = this.v; b = t; break; // eslint-disable-line prettier/prettier
      case 3: r = p; g = q; b = this.v; break; // eslint-disable-line prettier/prettier
      case 4: r = t; g = p; b = this.v; break; // eslint-disable-line prettier/prettier
      case 5: r = this.v; g = p; b = q; break; // eslint-disable-line prettier/prettier
    }

    return new RGBColor({
      red: Math.round(r * 255),
      green: Math.round(g * 255),
      blue: Math.round(b * 255),
    });
  }

  /**
   * Applies a brightness adjustment to this colour.
   * @param brightness brightness as percentage between 0 and 100.
   */
  withBrightness(brightness: number): HSVColor {
    return new HSVColor({ h: this.h, s: this.s, v: (this.v * brightness) / 100 });
  }
}

export class HSLColor implements IHSLColor {
  // hue, float: [0..1]
  h: number;
  // saturation, float: [0..1]
  s: number;
  // luminosity, float: [0..1]
  l: number;

  constructor(color?: IHSLColor) {
    this.h = color?.h || 0;
    this.s = color?.s || 0;
    this.l = color?.l || 0;
  }

  toCSS(alpha?: number): string {
    return `hsla(${this.h * 360}, ${this.s * 100}%, ${this.l * 100}%, ${alpha ?? 1})`;
  }
}

/**
 * RGBColor defines a colour by its red, green and blue components.
 */
export class RGBColor implements IRGBColor {
  /** The colour black. */
  public static BLACK: RGBColor = new RGBColor({ red: 0, green: 0, blue: 0 });
  /** The colour white */
  public static WHITE: RGBColor = new RGBColor({ red: 255, green: 255, blue: 255 });
  /** The colour red */
  public static RED: RGBColor = new RGBColor({ red: 255, green: 0, blue: 0 });
  /** The colour orange */
  public static ORANGE: RGBColor = new RGBColor({ red: 255, green: 127, blue: 0 });
  /** The colour yellow */
  public static YELLOW: RGBColor = new RGBColor({ red: 255, green: 255, blue: 0 });
  /** The colour lime */
  public static LIME: RGBColor = new RGBColor({ red: 172, green: 255, blue: 0 });
  /** The colour green */
  public static GREEN: RGBColor = new RGBColor({ red: 0, green: 255, blue: 0 });
  /** The color turquoise */
  public static TURQUOISE: RGBColor = new RGBColor({ red: 0, green: 164, blue: 255 });
  /** The colour light blue */
  public static LIGHTBLUE: RGBColor = new RGBColor({ red: 0, green: 255, blue: 255 });
  /** The colour blue */
  public static BLUE: RGBColor = new RGBColor({ red: 0, green: 0, blue: 255 });
  /** The colour purple */
  public static PURPLE: RGBColor = new RGBColor({ red: 200, green: 0, blue: 255 });
  /** The colour pink */
  public static PINK: RGBColor = new RGBColor({ red: 255, green: 0, blue: 200 });
  /** The colour of standard room lighting */
  public static ROOMLIGHT: RGBColor = new RGBColor({ red: 255, green: 132, blue: 24 });

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
    return `rgb(${this.red}, ${this.green}, ${this.blue})`;
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
    const s = max === 0 ? 0 : d / max;
    const v = max / 255;

    switch (max) {
      case min:
        h = 0;
        break;
      case this.red:
        h = this.green - this.blue + d * (this.green < this.blue ? 6 : 0);
        h /= 6 * d;
        break;
      case this.green:
        h = this.blue - this.red + d * 2;
        h /= 6 * d;
        break;
      case this.blue:
        h = this.red - this.green + d * 4;
        h /= 6 * d;
        break;
    }

    return new HSVColor({ h: h, s: s, v: v });
  }

  static is(c: any): c is IRGBColor {
    return (
      c &&
      typeof c.red === 'number' &&
      typeof c.green === 'number' &&
      typeof c.blue === 'number' &&
      c.red >= 0 &&
      c.red <= 255 &&
      c.green >= 0 &&
      c.green <= 255 &&
      c.blue >= 0 &&
      c.blue <= 255
    );
  }
}

export const isHSVList = (x: any): x is IHSVColor[] => {
  return Array.isArray(x) && !x.find(c => !HSVColor.is(c));
};

export const isRGBList = (x: any): x is IRGBColor[] => {
  return Array.isArray(x) && !x.find(c => !RGBColor.is(c));
};
