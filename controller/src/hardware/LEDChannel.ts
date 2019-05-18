import * as Bluebird from 'bluebird';
import Color from '../common/Color';
import { InterpolationType } from '../patterns/options/FadePatternOptions';
import { settings } from '../server';
import { Interpolate } from './interpolate';
import Pin from './Pin';

const FPS: number = 40;

/**
 * Defines a mapping between a channels colours (red, green and blue) and their respective
 * pin numbers.
 */
interface ChannelMapping {
  red: number;
  green: number;
  blue: number;
}

/**
 * Map to contain the mappings for the different channels.
 */
interface ChannelMap {
  [key: number]: ChannelMapping;
}

/**
 * Represents and controls a single LED channel, i.e. LED strip(s).
 * The number given to it defines what pins the red, green and blue parts of the LED channel
 * are mapped to.
 */
class LEDChannel {
  private static channelMap: ChannelMap = {
    1: { red: 0, green: 1, blue: 2 },
    2: { red: 3, green: 4, blue: 5 },
    3: { red: 6, green: 7, blue: 8 },
  };

  /** Channel number */
  public number: number;

  /** Red pin */
  public red: Pin;
  /** Green pin */
  public green: Pin;
  /** Blue pin */
  public blue: Pin;

  /** The currently displayed colour, but without brightness etc applied to it */
  private currentBaseColor: Color;

  /**
   * Creates and initialises an LED channel, i.e. LED strip.
   * @param channelNr Channel number
   */
  constructor(channelNr: number) {
    this.number = channelNr;
    const channelMapping: ChannelMapping = LEDChannel.channelMap[this.number];
    if (channelMapping) {
      this.red = new Pin(channelMapping.red);
      this.green = new Pin(channelMapping.green);
      this.blue = new Pin(channelMapping.blue);
      this.setColor(Color.BLACK);
    } else {
      throw new Error('Channel ' + this.number + ' does not exist!');
    }
  }

  /**
   * Returns the colour this LED channel is currently displaying.
   */
  public getColor(): Color {
    return new Color({ red: this.red.value, green: this.green.value, blue: this.blue.value });
  }

  /**
   * Sets a color on the LED channel. Applies roomlight, flux and brightness colour correction.
   * @param color Color to set
   */
  public setColor(color: Color): void {
    this.currentBaseColor = color;
    let adjustedColor = color.withRoomLight(settings ? settings.getRoomLight() : 0);
    adjustedColor = adjustedColor.withFlux(settings ? settings.getFlux() : 0);
    adjustedColor = adjustedColor.withBrightness(settings ? settings.getBrightness() : 100);

    if (this.red.value !== adjustedColor.red) this.red.value = adjustedColor.red;
    if (this.green.value !== adjustedColor.green) this.green.value = adjustedColor.green;
    if (this.blue.value !== adjustedColor.blue) this.blue.value = adjustedColor.blue;
  }

  /**
   * Sets a color on the LED channel. DOES NOT apply roomlight, flux and brightness colour corrections.
   * @param color Color to set
   */
  public setColorDirectly(color: Color): void {
    if (this.red.value !== color.red) this.red.value = color.red;
    if (this.green.value !== color.green) this.green.value = color.green;
    if (this.blue.value !== color.blue) this.blue.value = color.blue;
  }

  /**
   * Makes this LED channel fade from the current colour to another over the
   * specified duration (in seconds)
   * @param to The colour to fade to
   * @param duration How long the fade should take, in seconds.
   */
  public setFade(
    to: Color,
    duration: number,
    interpolation: InterpolationType = InterpolationType.LINEAR,
  ): Bluebird<void> {
    return new Bluebird<void>(async (resolve, reject, onCancel) => {
      const interpFunc = Interpolate.for(interpolation);
      const from = this.currentBaseColor;
      const difference = {
        red: to.red - from.red,
        green: to.green - from.green,
        blue: to.blue - from.blue,
      };

      let loops: number = 0;
      const numFrames: number = duration * FPS;
      const interval: number = 1000 / FPS;
      const timer: NodeJS.Timer = setInterval(() => {
        if (loops >= numFrames) {
          clearInterval(timer);
          return resolve();
        }

        const baseColor = new Color({
          red: from.red + interpFunc(difference.red, loops, numFrames),
          green: from.green + interpFunc(difference.green, loops, numFrames),
          blue: from.blue + interpFunc(difference.blue, loops, numFrames),
        });
        let adjustedColor = baseColor.withRoomLight(settings.getRoomLight());
        adjustedColor = adjustedColor.withFlux(settings.getFlux());
        adjustedColor = adjustedColor.withBrightness(settings.getBrightness());

        this.currentBaseColor = baseColor;
        this.red.value = adjustedColor.red;
        this.green.value = adjustedColor.green;
        this.blue.value = adjustedColor.blue;

        loops++;
      }, interval - interval * getIntervalFixFactor(duration * 1000));

      onCancel(() => clearInterval(timer));
    });
  }
}

const intervalFixFactors = {
  50: 0.3,
  75: 0.28,
  100: 0.18,
  200: 0.1,
  300: 0.1,
  400: 0.072,
  500: 0.061,
  600: 0.047,
  700: 0.04,
  800: 0.04,
  900: 0.04,
  1000: 0.04,
  1500: 0.04,
  2000: 0.04,
  3000: 0.04,
};

/**
 * Retrieves a fixing factor for the intervals in a fade from its supposed duration
 * @param duration duration the fade should take in milliseconds.
 */
const getIntervalFixFactor = (duration: number): number => {
  if (duration < 60) return intervalFixFactors[50];
  if (duration < 90) return intervalFixFactors[75];
  if (duration < 150) return intervalFixFactors[100];
  if (duration < 250) return intervalFixFactors[200];
  if (duration < 350) return intervalFixFactors[300];
  if (duration < 450) return intervalFixFactors[400];
  if (duration < 550) return intervalFixFactors[500];
  if (duration < 650) return intervalFixFactors[600];
  if (duration < 750) return intervalFixFactors[700];
  if (duration < 850) return intervalFixFactors[800];
  if (duration < 950) return intervalFixFactors[900];
  if (duration < 1250) return intervalFixFactors[1000];
  if (duration < 1750) return intervalFixFactors[2000];
  return intervalFixFactors[3000];
};

export default LEDChannel;
