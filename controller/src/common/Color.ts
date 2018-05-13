/**
 * Represents a colour. A colour should have red, green and blue values between 0 and 255.
 */
class Color {
  /** The colour black. */
  public static BLACK: Color = new Color(0, 0, 0);
  /** The colour blue */
  public static BLUE: Color = new Color(0, 0, 255);
  /** The colour green */
  public static GREEN: Color = new Color(0, 255, 0);
  /** The colour purple */
  public static PURPLE: Color = new Color(255, 0, 255);
  /** The colour red */
  public static RED: Color = new Color(255, 0, 0);
  /** The colour white */
  public static WHITE: Color = new Color(255, 255, 255);
  /** The colour of standard room lighting */
  public static ROOMLIGHT: Color = new Color(255, 241, 224);

  public static isColor(x: any): x is Color {
    if (typeof x.red !== 'number' || typeof x.green !== 'number' || typeof x.blue !== 'number') {
      return false;
    }
    return true;
  }

  /** The amount of red in this colour. */
  public red: number;
  /** The amount of green in this colour. */
  public green: number;
  /** The amount of blue in this colour. */
  public blue: number;

  constructor(red: number, green: number, blue: number) {
    if (red < 0 || red > 255) throw new Error('Red value not in range: ' + red);
    if (green < 0 || green > 255) throw new Error('Green value not in range: ' + green);
    if (blue < 0 || blue > 255) throw new Error('Blue value not in range: ' + blue);

    this.red = red;
    this.green = green;
    this.blue = blue;
  }

  /**
   * Sets this colour to a specific brightness.
   * @param brightness Percentage of colour brightness
   */
  public withBrightness(brightness: number): Color {
    if (brightness < 0 || brightness > 100) throw new Error('Brightness not in range: ' + brightness);
    if (brightness === 0) return Color.BLACK;
    if (brightness === 100) return this;

    const factor: number = brightness / 100;
    return new Color(
      this.red * factor,
      this.green * factor,
      this.blue * factor
    );
  }

  /**
   * Blends this colour with some standard room lighting colour.
   * @param roomLight Percentage of room light to be blended through.
   */
  public withRoomLight(roomLight: number): Color {
    if (roomLight < 0 || roomLight > 100) throw new Error('Room light not in range: ' + roomLight);
    if (roomLight === 0) return this;
    if (roomLight === 100) return Color.ROOMLIGHT;

    const factor: number = roomLight / 100;
    return this;
  }
}

export default Color;
