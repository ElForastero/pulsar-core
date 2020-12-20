import { variants, getVariantKey } from '../variants/variants';

describe('Variants Suite', () => {
  it('works with anonymous declarations', () => {
    const result = variants({
      primary: {
        color: 'red',
      },
      secondary: {
        color: 'blue',
      },
    });

    expect(result).toMatchObject({
      [getVariantKey('variant', 'primary')]: { color: 'red' },
      [getVariantKey('variant', 'secondary')]: { color: 'blue' },
    });
  });

  it('works with named declarations', () => {
    const result = variants({
      prop: 'kind',
      variants: {
        primary: {
          color: 'red',
        },
        secondary: {
          color: 'blue',
        },
      },
    });

    expect(result).toMatchObject({
      [getVariantKey('kind', 'primary')]: { color: 'red' },
      [getVariantKey('kind', 'secondary')]: { color: 'blue' },
    });
  });

  it('works with multiple mixed variants', () => {
    const result = variants([
      {
        primary: {
          color: 'red',
        },
        secondary: {
          color: 'blue',
        },
      },
      {
        prop: 'size',
        variants: {
          small: {
            height: 30,
          },
          big: {
            height: 40,
          },
        },
      },
    ]);

    expect(result).toMatchObject({
      [getVariantKey('variant', 'primary')]: { color: 'red' },
      [getVariantKey('variant', 'secondary')]: { color: 'blue' },
      [getVariantKey('size', 'small')]: { height: 30 },
      [getVariantKey('size', 'big')]: { height: 40 },
    });
  });
});
