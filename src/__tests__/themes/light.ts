// @ts-ignore
import { Theme } from '../../index';

const palette = {
  primary: {
    500: '#3B5FF1',
    400: '#5468FF',
    300: '#899FF7',
    200: '#B1BFF9',
    100: '#D8DFFC',
  },
  secondary: {
    500: '#344356',
    400: '#506784',
    300: '#748CAB',
    200: '#A2B2C7',
    100: '#D1D9E3',
  },
  neutral: {
    500: '#E1E5EE',
    400: '#EDEFF5',
    300: '#F3F5F8',
    200: '#F9FAFC',
    100: '#FFFFFF',
  },
  warning: {
    500: '#FFCC3E',
    400: '#FFD665',
    300: '#FFE08B',
    200: '#FFEBB2',
    100: '#FFF5D8',
  },
  danger: {
    500: '#E45851',
    400: '#E97974',
    300: '#EF9B97',
    200: '#F4BCB9',
    100: '#FADEDC',
  },
  success: {
    500: '#62CA76',
    400: '#81D591',
    300: '#A1DFAD',
    200: '#C0EAC8',
    100: '#E0F4E4',
  },
};

export const theme: Theme = {
  breakpoints: {
    phone: 320,
    tablet: 768,
    desktop: 1280,
  },
  colors: {
    primary: palette.primary[500],
  },
};
