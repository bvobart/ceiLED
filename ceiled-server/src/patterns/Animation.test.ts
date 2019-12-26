import Color from '../common/Color';
import { Animation } from './Animation';
import { MoodPattern } from './MoodPattern';
import { SolidPattern } from './SolidPattern';

describe('Animation', () => {
  describe('iterator', () => {
    it('loops continuously over list of patterns with length 1', () => {
      const patterns = [
        new SolidPattern(1, Color.BLACK),
        new MoodPattern(1, 'test'),
        new MoodPattern(1, 'test2'),
      ];
      const anim = new Animation(patterns);
      let index = 0;
      for (const pattern of anim) {
        expect(pattern).toEqual(patterns[index % patterns.length]);
        index++;
        if (index > 999) break;
      }
    });

    it('loops over list of patterns with differing lengths', () => {
      const patterns = [
        new SolidPattern(2, Color.BLACK),
        new MoodPattern(3, 'test'),
        new MoodPattern(1, 'test2'),
      ];
      const anim = new Animation(patterns);
      expect(anim.next().value).toEqual(patterns[0]);
      expect(anim.next().value).toEqual(patterns[0]);
      expect(anim.next().value).toEqual(patterns[1]);
      expect(anim.next().value).toEqual(patterns[1]);
      expect(anim.next().value).toEqual(patterns[1]);
      expect(anim.next().value).toEqual(patterns[2]);
    });
  });
});
