import { ImageStyle, TextStyle, ViewStyle } from 'react-native';

export type NamedStyles<T> = {
  [P in keyof T]: ViewStyle | TextStyle | ImageStyle;
};
export type Styles = ViewStyle | TextStyle | ImageStyle;
export type Props = { [key: string]: string | number | boolean };

export interface Theme {}
