import { MoodBuilder } from '..';
import Color from '../../common/Color';
import { Animation } from '../../patterns/Animation';
import { FadePattern } from '../../patterns/FadePattern';
import { PatternType } from '../../patterns/Pattern';
import { range } from '../../patterns/utils';

export class AlternatingFadeBuilder implements MoodBuilder {
  private channelz: number = 0;
  private colorz: Color[] = [];
  private typ: PatternType.FADE_LINEAR | PatternType.FADE_SIGMOID = PatternType.FADE_LINEAR;

  public channels(channels: number): AlternatingFadeBuilder {
    this.channelz = channels;
    return this;
  }

  public colors(colors: Color[]): AlternatingFadeBuilder {
    this.colorz = colors;
    return this;
  }

  public type(type: PatternType.FADE_LINEAR | PatternType.FADE_SIGMOID): AlternatingFadeBuilder {
    this.typ = type;
    return this;
  }

  public generate(): Map<number, Animation> {
    const res = new Map<number, Animation>();
    const colors = this.colorz;

    for (const channel of range(this.channelz)) {
      let pattern: FadePattern;
      if (channel % 2 === 0) {
        pattern = new FadePattern(this.typ, colors.length, [...colors]);
        res.set(channel, new Animation([pattern]));
      } else {
        pattern = new FadePattern(this.typ, colors.length, [...colors].reverse());
      }
      res.set(channel, new Animation([pattern]));
    }

    return res;
  }
}
