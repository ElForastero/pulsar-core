import React, { createContext } from 'react';
import { Theme } from './types';

interface IThemeContext {
  light: Theme;
  dark: Theme;
}

export const ThemeContext = createContext<IThemeContext>({
  light: {},
  dark: {},
});

interface ThemeProviderProps {
  value: {
    light: Theme;
    dark: Theme;
  };
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ value, children }) => (
  <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
);
