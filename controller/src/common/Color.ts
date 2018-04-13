/**
 * Represents a colour. A colour should have red, green and blue values between 0 and 255.
 */
class Color {
  public red: number;
  public green: number;
  public blue: number;

  constructor(red: number, green: number, blue: number) {
    this.red = red;
    this.green = green;
    this.blue = blue;
  }
}

export default Color;
