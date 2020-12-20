import { useWindowDimensions } from 'react-native';
import { ScreenOrientation } from '../shared/enums';

/**
 * Use device orientation.
 */
export const useOrientation = () => {
  const { width, height } = useWindowDimensions();

  return width < height ? ScreenOrientation.PORTRAIT : ScreenOrientation.LANDSCAPE;
};
