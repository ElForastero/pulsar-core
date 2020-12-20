import { Dimensions, ScaledSize } from 'react-native';
import { NamedStyles, Styles } from '../types';
import { MediaQueryType } from '../shared/enums';

/**
 * Emulating min-width media query.
 */
export const minWidth = <T extends Styles>(value: number, styles: T): any =>
  media(MediaQueryType.MIN_WIDTH, value, styles);

/**
 * Emulating max-width media query.
 */
export const maxWidth = <T extends Styles>(value: number, styles: T): any =>
  media(MediaQueryType.MAX_WIDTH, value, styles);

/**
 * Emulating min-height media query.
 */
export const minHeight = <T extends Styles>(value: number, styles: T): any =>
  media(MediaQueryType.MIN_HEIGHT, value, styles);

/**
 * Emulating min-height media query.
 */
export const maxHeight = <T extends Styles>(value: number, styles: T): any =>
  media(MediaQueryType.MAX_HEIGHT, value, styles);

/**
 * Basic media helper.
 */
const media = <T extends NamedStyles<T> | NamedStyles<any>>(
  type: MediaQueryType,
  value: number,
  styles: T | NamedStyles<T>
): T => {
  return {
    [getMediaQueryKey(type, value)]: styles,
  } as T;
};

/**
 * Generates styles key for media query.
 */
export const getMediaQueryKey = (type: MediaQueryType, value: number, component?: string) => {
  return ['_media', type, value, component].filter(v => v !== undefined).join(':');
};

/**
 * Extracts media query details from the given key.
 */
export const getMediaQueryDetailsFromKey = (
  key: string
): {
  type: MediaQueryType;
  value: number;
  component: string;
} => {
  const [type, value, component] = key.split(':').slice(1);

  return { type: type as MediaQueryType, value: Number(value), component };
};

/**
 * Checks if object contains a media query definition.
 */
export const hasMediaQuery = (obj: any) => Object.keys(obj).some(isMediaQueryKey);

/**
 * Checks if key is a media query key.
 */
export const isMediaQueryKey = (key: string) => key.match(/^_media:/);

/**
 * Flatten media queries into main styles object.
 */
export const flattenMediaQueries = <T extends NamedStyles<T>>(
  styles: NamedStyles<T>,
  key: string
): void => {
  // @ts-ignore
  const mediaQueries = Object.keys(styles[key]).filter(k => k.match(/^_media:/));

  for (let mediaQueryKey of mediaQueries) {
    const { type, value } = getMediaQueryDetailsFromKey(mediaQueryKey);

    Object.defineProperty(styles, getMediaQueryKey(type, value, key), {
      enumerable: true,
      // @ts-ignore
      value: styles[key][mediaQueryKey],
    });

    // @ts-ignore
    delete styles[key][mediaQueryKey];
  }
};

/**
 * Compose main style keys with media keys.
 */
export const compileMediaQueries = <T extends NamedStyles<any>>(styles: T) => {
  const copy = { ...styles };
  const mediaQueries = Object.keys(styles).filter(k => k.match(/^_media:/));
  const dimensions = Dimensions.get('window');

  for (let key of mediaQueries) {
    const { component, type, value } = getMediaQueryDetailsFromKey(key);

    if (matches(type, value, dimensions)) {
      if (!Array.isArray(copy[component])) {
        // @ts-ignore
        copy[component] = [copy[component], copy[key]];
      } else {
        // @ts-ignore
        copy[component].push(copy[key]);
      }
    }
  }

  return copy as T;
};

export const matches = (type: MediaQueryType, value: number, { width, height }: ScaledSize) => {
  switch (type) {
    case MediaQueryType.MIN_WIDTH:
      return width >= value;
    case MediaQueryType.MAX_WIDTH:
      return width <= value;
    case MediaQueryType.MIN_HEIGHT:
      return height >= value;
    case MediaQueryType.MAX_HEIGHT:
      return height <= value;
    default:
      return false;
  }
};

/**
 * Returns true if media-query got triggered.
 */
export const isBoundaryIntersected = (
  type: MediaQueryType,
  threshold: number,
  old: ScaledSize,
  { width, height }: ScaledSize
) => {
  switch (type) {
    case MediaQueryType.MIN_WIDTH:
      return (
        (width >= threshold && old.width < threshold) ||
        (width < threshold && old.width >= threshold)
      );
    case MediaQueryType.MAX_WIDTH:
      return (
        (width <= threshold && old.width > threshold) ||
        (width > threshold && old.width <= threshold)
      );
    case MediaQueryType.MIN_HEIGHT:
      return (
        (height >= threshold && old.height < threshold) ||
        (height < threshold && old.height >= threshold)
      );
    case MediaQueryType.MAX_HEIGHT:
      return (
        (height <= threshold && old.height > threshold) ||
        (height > threshold && old.height <= threshold)
      );
  }
};
