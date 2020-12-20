import { getMediaQueryKey, maxWidth, minWidth, minHeight, maxHeight } from '../media/mediaQueries';
import { MediaQueryType } from '../shared/enums';

describe('Media Queries Suite', () => {
  it('works with minWidth', () => {
    const media = minWidth(768, {
      height: 40,
    });

    expect(media).toMatchObject({
      [getMediaQueryKey(MediaQueryType.MIN_WIDTH, 768)]: {
        height: 40,
      },
    });
  });

  it('works with maxWidth', () => {
    const media = maxWidth(768, {
      height: 40,
    });

    expect(media).toMatchObject({
      [getMediaQueryKey(MediaQueryType.MAX_WIDTH, 768)]: {
        height: 40,
      },
    });
  });

  it('works with minHeight', () => {
    const media = minHeight(768, {
      height: 40,
    });

    expect(media).toMatchObject({
      [getMediaQueryKey(MediaQueryType.MIN_HEIGHT, 768)]: {
        height: 40,
      },
    });
  });

  it('works with maxHeight', () => {
    const media = maxHeight(768, {
      height: 40,
    });

    expect(media).toMatchObject({
      [getMediaQueryKey(MediaQueryType.MAX_HEIGHT, 768)]: {
        height: 40,
      },
    });
  });
});
