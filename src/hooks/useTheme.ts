import { useContext } from 'react';
import { ThemeContext } from '../ThemeProvider/ThemeProvider';
import { useColorScheme } from 'react-native';

/**
 * Use theme from ThemeProvider based on Appearance.
 */
export const useTheme = () => {
  const themes = useContext(ThemeContext);
  const scheme = useColorScheme();

  return themes[scheme || 'light'];
};
