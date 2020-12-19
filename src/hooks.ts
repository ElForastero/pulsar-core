import { ThemeContext } from './ThemeProvider';
import { useContext } from 'react';
import { useColorScheme, useWindowDimensions } from 'react-native';

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
