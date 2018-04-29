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
  /** The colour red */
  public static RED: Color = new Color(255, 0, 0);
  /** The colour white */
  public static WHITE: Color = new Color(255, 255, 255);

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
    this.red = red;
    this.green = green;
    this.blue = blue;
  }
}

export default Color;
