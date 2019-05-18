import determineCurrentFlux from './flux';

interface IColor {
  red: number;
  green: number;
  blue: number;
}

/**
 * Represents a colour. A colour should have red, green and blue values between 0 and 255.
 * Also contains some static standard colours, and the colours used for mixing a colour
 * with roomlight or applying a flux setting.
 *
 * Source for colour temperature to RGB values: https://academo.org/demos/colour-temperature-relationship/
 */
class Color implements IColor {
  /** The colour black. */
  public static BLACK: Color = new Color({ red: 0, green: 0, blue: 0 });
  /** The colour blue */
  public static BLUE: Color = new Color({ red: 0, green: 0, blue: 255 });
  /** The colour green */
  public static GREEN: Color = new Color({ red: 0, green: 255, blue: 0 });
  /** The colour purple */
  public static PURPLE: Color = new Color({ red: 255, green: 0, blue: 255 });
  /** The colour red */
  public static RED: Color = new Color({ red: 255, green: 0, blue: 0 });
  /** The colour white */
  public static WHITE: Color = new Color({ red: 255, green: 255, blue: 255 });

  /** The colour of standard room lighting */
  public static ROOMLIGHT: Color = new Color({ red: 255, green: 241, blue: 224 });
  /** The colour used for flux setting 1, i.e. 6000K */
  public static FLUX1: Color = new Color({ red: 255, green: 246, blue: 237 });
  /** The colour used for flux setting 2, i.e. 5500K */
  public static FLUX2: Color = new Color({ red: 255, green: 237, blue: 222 });
  /** The colour used for flux setting 3, i.e. 5000K */
  public static FLUX3: Color = new Color({ red: 255, green: 228, blue: 206 });
  /** The colour used for flux setting 4, i.e. 4500K */
  public static FLUX4: Color = new Color({ red: 255, green: 218, blue: 187 });
  /** The colour used for flux setting 5, i.e. 4000K */
  public static FLUX5: Color = new Color({ red: 255, green: 206, blue: 166 });

  public static isColor(x: any): x is Color {
    if (typeof x.red !== 'number' || typeof x.green !== 'number' || typeof x.blue !== 'number') {
      return false;
    }
    return true;
  }

  public static random(): Color {
    return new Color({
      red: Math.round(Math.random() * 255),
      green: Math.round(Math.random() * 255),
      blue: Math.round(Math.random() * 255),
    });
  }

  /** The amount of red in this colour. */
  public red: number;
  /** The amount of green in this colour. */
  public green: number;
  /** The amount of blue in this colour. */
  public blue: number;

  constructor({ red, green, blue }: IColor) {
    if (red < 0 || red > 255) throw new Error('Red value not in range: ' + red);
    if (green < 0 || green > 255) throw new Error('Green value not in range: ' + green);
    if (blue < 0 || blue > 255) throw new Error('Blue value not in range: ' + blue);

    this.red = red;
    this.green = green;
    this.blue = blue;
  }

  /**
   * Mixes this colour with another colour.
   * @param color color to mix with
   */
  public blend(color: Color): Color {
    return new Color({
      red: Math.round(this.red * (color.red / 255)),
      green: Math.round(this.green * (color.green / 255)),
      blue: Math.round(this.blue * (color.blue / 255)),
    });
  }

  /**
   * Sets this colour to a specific brightness.
   * @param brightness Percentage of colour brightness
   */
  public withBrightness(brightness: number): Color {
    if (brightness < 0 || brightness > 100)
      throw new Error('Brightness not in range: ' + brightness);
    if (brightness === 0) return Color.BLACK;
    if (brightness === 100) return this;

    const factor: number = brightness / 100;
    return new Color({
      red: this.red * factor,
      green: this.green * factor,
      blue: this.blue * factor,
    });
  }

  /**
   * Blends this colour with some standard room lighting colour.
   * @param roomLight Percentage of room light to be blended through.
   */
  public withRoomLight(roomLight: number): Color {
    if (roomLight < 0 || roomLight > 100) throw new Error('Room light not in range: ' + roomLight);
    if (roomLight === 0) return this;
    if (roomLight === 100) return Color.ROOMLIGHT;

    const factor = roomLight / 100;
    return new Color({
      red: Math.max(this.red, factor * Color.ROOMLIGHT.red),
      green: Math.max(this.green, factor * Color.ROOMLIGHT.green),
      blue: Math.max(this.blue, factor * Color.ROOMLIGHT.blue),
    });
  }

  /**
   * Blend this colour with one of the flux colours given the flux setting.
   * @param flux current flux setting, see ControllerSettings for more detail
   */
  public withFlux(flux: number): Color {
    switch (flux) {
      case 0:
        return this;
      case 1:
        return this.blend(Color.FLUX1);
      case 2:
        return this.blend(Color.FLUX2);
      case 3:
        return this.blend(Color.FLUX3);
      case 4:
        return this.blend(Color.FLUX4);
      case 5:
        return this.blend(Color.FLUX5);
      default:
        return this.blend(determineCurrentFlux(new Date()));
    }
  }
}

export default Color;
