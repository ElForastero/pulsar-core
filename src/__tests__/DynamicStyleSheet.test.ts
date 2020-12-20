import '../polyfill';
import { Dimensions, StyleSheet } from 'react-native';
import { renderHook } from '@testing-library/react-hooks';
import { DynamicStyleSheet } from '../DynamicStyleSheet';
import { variants } from '../variants/variants';
import { maxHeight, maxWidth, minHeight, minWidth } from '../media/mediaQueries';

interface Theme {
  colors: {
    primary: string;
    secondary: string;
  };
}

const light: Theme = {
  colors: {
    primary: '#3B5FF1',
    secondary: '#344356',
  },
};

const dark: Theme = {
  colors: {
    primary: '#3B5FF1',
    secondary: '#344356',
  },
};

DynamicStyleSheet.lightTheme = light;
DynamicStyleSheet.darkTheme = dark;

describe('DynamicStyleSheet suite', () => {
  it('works with simple styles', () => {
    const styles = {
      button: {
        color: 'lightblue',
      },
      text: {
        fontSize: 14,
      },
    };

    const useStyles = DynamicStyleSheet.create(() => styles);
    const { result } = renderHook(() => useStyles());

    const compiled = StyleSheet.flatten(result.current);
    expect(compiled).toMatchObject(styles);
  });

  it('works with dynamic styles', () => {
    const useStyles = DynamicStyleSheet.create(theme => ({
      button: {
        color: theme.colors.primary,
      },
    }));
    const { result } = renderHook(() => useStyles());

    const compiled = StyleSheet.flatten(result.current);
    expect(compiled).toMatchObject({
      button: {
        color: light.colors.primary,
      },
    });
  });

  it('works with variants', () => {
    const useStyles = DynamicStyleSheet.create(() => ({
      button: {
        height: 44,
        ...variants({
          primary: {
            color: 'red',
          },
          secondary: {
            color: 'blue',
          },
        }),
      },
    }));

    const { result: secondary } = renderHook(() => useStyles({ variant: 'secondary' }));
    const compiled = StyleSheet.flatten(secondary.current.button);
    expect(compiled).toMatchObject({ height: 44, color: 'blue' });
  });

  it('updates variants on props changing', () => {
    const useStyles = DynamicStyleSheet.create(() => ({
      button: {
        height: 44,
        ...variants({
          primary: {
            color: 'red',
          },
          secondary: {
            color: 'blue',
          },
        }),
      },
    }));

    const { result, rerender } = renderHook(({ variant }) => useStyles({ variant }), {
      initialProps: { variant: 'secondary' },
    });
    expect(StyleSheet.flatten(result.current.button)).toMatchObject({ height: 44, color: 'blue' });
    rerender({ variant: 'primary' });
    expect(StyleSheet.flatten(result.current.button)).toMatchObject({ height: 44, color: 'red' });
  });

  it('works with multiple variants', () => {
    const useStyles = DynamicStyleSheet.create(() => ({
      button: {
        fontSize: 16,
        ...variants([
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
                height: 40,
              },
              big: {
                height: 50,
              },
            },
          },
        ]),
      },
    }));

    const { result: variantPrimary } = renderHook(() =>
      useStyles({ variant: 'primary', size: 'big' })
    );
    const compiledPrimary = StyleSheet.flatten(variantPrimary.current.button);
    expect(compiledPrimary).toMatchObject({ fontSize: 16, height: 50, color: 'red' });

    const { result: variantSecondary } = renderHook(() =>
      useStyles({ variant: 'secondary', size: 'small' })
    );
    const compiled = StyleSheet.flatten(variantSecondary.current.button);
    expect(compiled).toMatchObject({ fontSize: 16, height: 40, color: 'blue' });
  });

  it('works with missing variant property', () => {
    const useStyles = DynamicStyleSheet.create(() => ({
      button: {
        height: 44,
        ...variants({
          primary: {
            color: 'red',
          },
          secondary: {
            color: 'blue',
          },
        }),
      },
    }));

    const { result } = renderHook(() => useStyles({}));
    const compiledPrimary = StyleSheet.flatten(result.current.button);
    expect(compiledPrimary).toMatchObject({ height: 44 });
  });

  it('works with min-width media query', () => {
    const useStyles = DynamicStyleSheet.create(() => ({
      button: {
        height: 40,
        ...minWidth(768, {
          height: 44,
        }),
      },
    }));

    // @ts-ignore
    Dimensions.get = () => ({ width: 768 });

    const { result } = renderHook(() => useStyles({}));
    const compiledPrimary = StyleSheet.flatten(result.current.button);
    expect(compiledPrimary).toMatchObject({ height: 44 });
  });

  it('works with max-width media query', () => {
    const useStyles = DynamicStyleSheet.create(() => ({
      button: {
        height: 50,
        ...maxWidth(768, {
          height: 44,
        }),
      },
    }));

    // @ts-ignore
    Dimensions.get = () => ({ width: 768 });

    const { result } = renderHook(() => useStyles({}));
    const compiledPrimary = StyleSheet.flatten(result.current.button);
    expect(compiledPrimary).toMatchObject({ height: 44 });
  });

  it('works with min-height media query', () => {
    const useStyles = DynamicStyleSheet.create(() => ({
      button: {
        height: 44,
        ...minHeight(768, {
          height: 50,
        }),
      },
    }));

    // @ts-ignore
    Dimensions.get = () => ({ height: 768 });

    const { result } = renderHook(() => useStyles({}));
    const compiledPrimary = StyleSheet.flatten(result.current.button);
    expect(compiledPrimary).toMatchObject({ height: 50 });
  });

  it('works with max-height media query', () => {
    const useStyles = DynamicStyleSheet.create(() => ({
      button: {
        height: 50,
        ...maxHeight(768, {
          height: 44,
        }),
      },
    }));

    // @ts-ignore
    Dimensions.get = () => ({ height: 768 });

    const { result } = renderHook(() => useStyles({}));
    const compiledPrimary = StyleSheet.flatten(result.current.button);
    expect(compiledPrimary).toMatchObject({ height: 44 });
  });
});
