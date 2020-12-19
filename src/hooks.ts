import { ThemeContext } from './ThemeProvider';
import { useContext, useEffect, useState, useRef } from 'react';
import { useColorScheme, useWindowDimensions, ScaledSize, Dimensions } from 'react-native';

export enum OrientationType {
  PORTRAIT = 'portrait',
  LANDSCAPE = 'landscape',
}

/**
 * Use theme from ThemeProvider based on Appearance.
 */
export const useTheme = () => {
  const themes = useContext(ThemeContext);
  const scheme = useColorScheme();

  return themes[scheme || 'light'];
};

/**
 * Use device orientation.
 */
export const useOrientation = () => {
  const { width, height } = useWindowDimensions();

  return width < height ? OrientationType.PORTRAIT : OrientationType.LANDSCAPE;
};

/**
 * Use some value derived from dimensions.
 */
type DerivedFunc<T> = (props: ScaledSize) => T;
export const useDerivedValue = <T>(func: DerivedFunc<T>): T => {
  const funcRef = useRef(func);
  const valueRef = useRef(func(Dimensions.get('window')));
  const [_, forceUpdate] = useState({});

  useEffect(() => {
    funcRef.current = func;
  }, [func]);

  useEffect(() => {
    const listener = ({ window }: { window: ScaledSize }) => {
      const newValue = funcRef.current(window);

      if (newValue !== valueRef.current) {
        valueRef.current = newValue;
        forceUpdate({});
      }
    };

    Dimensions.addEventListener('change', listener);

    return () => {
      Dimensions.removeEventListener('change', listener);
    };
  }, []);

  return valueRef.current;
};
