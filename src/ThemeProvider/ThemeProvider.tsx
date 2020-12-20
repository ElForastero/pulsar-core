import React, { createContext } from 'react';
import { Theme } from '../types';

interface IThemeContext {
  light: Theme;
  dark: Theme;
}

interface ThemeProviderProps {
  value: IThemeContext;
}

export const ThemeContext = createContext<IThemeContext>({
  light: {},
  dark: {},
});

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ value, children }) => (
  <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
);
