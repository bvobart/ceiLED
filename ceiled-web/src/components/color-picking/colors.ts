/**
 * HSVColor defines a colour by its Hue, Saturation and Value properties, go look that up on Wikipedia if you're unfamiliar.
 * The `h`, `s` and `v` values are assumed to be between 0 and 1.
 */
export class HSVColor {
  h: number;
  s: number;
  v: number;

  constructor({ h, s, v }: { h: number, s: number, v: number }) {
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
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255),
    });
  }

  static random(): HSVColor {
    return new HSVColor({ h: Math.random(), s: Math.random(), v: Math.random() });
  }
}

/**
 * RGBColor defines a colour by its red, green and blue components.
 */
export class RGBColor {
  r: number;
  g: number;
  b: number;

  constructor({ r, g, b }: { r: number, g: number, b: number }) {
    this.r = r;
    this.g = g;
    this.b = b;
  }

  equals(other: RGBColor): boolean {
    return this.r === other.r && this.g === other.g && this.b === other.b;
  }

  toCSS(): string {
    return `rgb(${this.r}, ${this.g}, ${this.b})`
  }

  // TODO: implement toHSV() ?
}
