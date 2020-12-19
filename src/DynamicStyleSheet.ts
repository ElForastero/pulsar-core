import { useState, useEffect, useRef } from 'react';
import { Appearance, ColorSchemeName, Dimensions, ScaledSize, StyleSheet } from 'react-native';
import { Theme, NamedStyles, Props } from './types';
import { flattenVariants, hasVariants, compileVariants } from './variants';
import {
  compileMediaQueries,
  flattenMediaQueries,
  getMediaQueryDetailsFromKey,
  hasMediaQuery,
  isBoundaryIntersected,
  isMediaQueryKey,
} from './mediaQueries';

type ThemeFunc<T extends NamedStyles<T>> = ((theme: Theme) => T) | T;
type ThemeHook<T extends NamedStyles<T>> = (props?: Props) => NamedStyles<T>;

/**
 * The sacred magic.
 */
export class DynamicStyleSheet {
  public static lightTheme: Theme = {};
  public static darkTheme: Theme = {};

  public static create<T extends NamedStyles<T> | NamedStyles<any>>(
    themeFunc: ThemeFunc<T>
  ): ThemeHook<T> {
    const cache = new Map<ColorSchemeName, T>();
    const colorScheme = Appearance.getColorScheme();
    // @todo Optimize this. No need to use dimensions if there are no media queries.
    const dimensions = Dimensions.get('window');

    const cacheTheme = (scheme: ColorSchemeName) =>
      cache.set(
        scheme,
        compileStyles(
          themeFunc,
          scheme === 'dark' ? DynamicStyleSheet.darkTheme : DynamicStyleSheet.lightTheme
        )
      );

    cacheTheme(colorScheme);

    const mediaQueryKeys = Object.keys(cache.get(colorScheme) as T)
      .filter(isMediaQueryKey)
      .map(getMediaQueryDetailsFromKey);

    /**
     * Custom React Hook for subscriptions and components' updating.
     */
    return (props: Props = {}) => {
      const [_, forceUpdate] = useState({});
      const schemeRef = useRef(colorScheme);
      const dimensionsRef = useRef(dimensions);
      const stylesRef = useRef(cache.get(colorScheme) as T);

      useEffect(() => {
        const appearanceListener: Appearance.AppearanceListener = ({ colorScheme: newScheme }) => {
          if (newScheme !== schemeRef.current) {
            schemeRef.current = newScheme;
            cacheTheme(newScheme);
            forceUpdate({});
          }
        };

        const dimensionsListener = ({ window }: { window: ScaledSize }) => {
          mediaQueryKeys.forEach(({ type, value }) => {
            if (isBoundaryIntersected(type, value, dimensionsRef.current, window)) {
              forceUpdate({});
              return;
            }
          });

          dimensionsRef.current = window;
        };

        Appearance.addChangeListener(appearanceListener);

        if (mediaQueryKeys.length > 0) {
          Dimensions.addEventListener('change', dimensionsListener);
        }

        return () => {
          Appearance.removeChangeListener(appearanceListener);
          Dimensions.removeEventListener('change', dimensionsListener);
        };
      }, []);

      return compileMediaQueries(compileVariants(stylesRef.current, props));
    };
  }
}

/**
 * Apply theme function and flatten variants.
 */
const compileStyles = <T extends NamedStyles<T>>(styles: ThemeFunc<T>, theme: Theme): T => {
  const styleObject = typeof styles === 'function' ? styles(theme) : styles;

  for (let key in styleObject) {
    if (styleObject.hasOwnProperty(key)) {
      if (hasVariants(styleObject[key])) {
        flattenVariants(styleObject, key);
      }
      if (hasMediaQuery(styleObject[key])) {
        flattenMediaQueries(styleObject, key);
      }
    }
  }

  return StyleSheet.create(styleObject);
};
