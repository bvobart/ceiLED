import Color from '../common/Color';
import { InterpolationType } from '../patterns/options/FadePatternOptions';

export interface Driver {
  channels: number;
  connect(): Promise<void>;
  close(): void;
  off(): Promise<void>;
  getColor(): Promise<Color>;
  setColor(channels: number[], color: Color): Promise<void>;
  setFade(
    channels: number[],
    to: Color,
    millis: number,
    interpolation: InterpolationType,
  ): Promise<void>;
}
