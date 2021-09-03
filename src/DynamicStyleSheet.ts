import { useState, useEffect, useRef, useMemo } from 'react';
import { Appearance, ColorSchemeName, StyleSheet } from 'react-native';
import { Theme, NamedStyles, Props } from './types';
import { flattenVariants, hasVariants, compileVariants, isVariantKey } from './variants/variants';
import {
  compileMediaQueries,
  flattenMediaQueries,
  getMediaQueryDetailsFromKey,
  hasMediaQuery,
  isMediaQueryKey,
} from './media/mediaQueries';
import { MediaQueryList, MediaQueryListener } from './media/MediaQueryList';
import { canUseDOM } from './utils/utils';

declare const window: { matchMedia: (query: string) => MediaQueryList };
type ThemeFunc<T extends NamedStyles<T>> = ((theme: Theme) => T) | T;
type ThemeHook<T extends NamedStyles<T>> = (props?: Props) => NamedStyles<T>;

const { themes, debug: enableDebug = false } = require('./config');

/**
 * The sacred magic.
 */
export class DynamicStyleSheet {
  public static create<T extends NamedStyles<T> | NamedStyles<any>>(
    themeFunc: ThemeFunc<T>
  ): ThemeHook<T> {
    debug('themes:', themes);
    const cache = new Map<ColorSchemeName, T>();
    const colorScheme = Appearance.getColorScheme();

    const cacheTheme = (scheme: ColorSchemeName) =>
      cache.set(scheme, compileStyles(themeFunc, scheme === 'dark' ? themes.dark : themes.light));

    cacheTheme(colorScheme);

    const mediaQueryKeys = Object.keys(cache.get(colorScheme) as T)
      .filter(isMediaQueryKey)
      .map(key => ({
        key,
        ...getMediaQueryDetailsFromKey(key),
      }));
    const variantsPresent = Object.keys(cache.get(colorScheme) as T).some(isVariantKey);

    /**
     * Custom React Hook for subscriptions and components' updating.
     */
    return (variants: Props = {}) => {
      const [_, forceUpdate] = useState({});
      const colorSchemeRef = useRef(colorScheme || 'light');

      useEffect(() => {
        const appearanceListener: Appearance.AppearanceListener = ({ colorScheme: newScheme }) => {
          debug('color scheme changed', newScheme);
          cacheTheme(newScheme);
          forceUpdate({});
        };

        const mqListener: MediaQueryListener = ctx => {
          debug('mq listener triggered', ctx.matches);
          // @todo investigate into this issue
          // Looks like Dimensions.get() has some delay
          setTimeout(() => {
            forceUpdate({});
          }, 0);
        };

        const mql: Array<MediaQueryList> = [];
        if (mediaQueryKeys.length > 0) {
          debug('adding mq listeners');
          mediaQueryKeys.forEach(({ key, type, value }) => {
            const query = canUseDOM ? `(${type}: ${value}px)` : key;
            mql.push(window.matchMedia(query));
            mql[mql.length - 1].addEventListener('change', mqListener);
          });
        }

        const subscription = Appearance.addChangeListener(appearanceListener);

        return () => {
          if (!canUseDOM) {
            debug('unsubscribing from mql');
            mql.forEach(mq => mq.unsubscribe());
            // @ts-expect-error https://github.com/DefinitelyTyped/DefinitelyTyped/pull/55354
            subscription.remove();
          } else {
            Appearance.removeChangeListener(appearanceListener);
          }
        };
      }, []);

      return useMemo(() => {
        const styles = { ...(cache.get(colorSchemeRef.current) as T) };
        compileVariants(styles, variants);
        compileMediaQueries(styles);

        return styles;

        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [_, ...Object.values(variants), variantsPresent]) as NamedStyles<T>;
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

const debug = (...data: any) => {
  if (enableDebug) {
    console.debug('[@pulsar/core]: ', ...data);
  }
};
