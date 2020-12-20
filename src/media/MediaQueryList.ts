import { Dimensions, ScaledSize } from 'react-native';
import { MediaQueryType } from '../shared/enums';
import { getMediaQueryDetailsFromKey, isBoundaryIntersected, matches } from './mediaQueries';

export type MediaQueryListener = (ctx: MediaQueryList) => any;
type MediaQuery = {
  type: MediaQueryType;
  value: number;
};

export class MediaQueryList {
  private listeners: Array<MediaQueryListener> = [];
  private dimensions: ScaledSize;
  private readonly media: MediaQuery;

  constructor(private query: string) {
    const { type, value } = getMediaQueryDetailsFromKey(query);
    this.dimensions = Dimensions.get('window');
    this.media = { type, value };

    Dimensions.addEventListener('change', this.dimensionsListener);
  }

  private dimensionsListener = ({ window }: { window: ScaledSize }) => {
    const { type, value } = this.media;

    if (isBoundaryIntersected(type, value, this.dimensions, window)) {
      this.update();
    }

    this.dimensions = window;
  };

  public addEventListener(type: 'change', listener: MediaQueryListener) {
    this.listeners.push(listener);
  }

  public removeEventListener(type: 'change', listener: MediaQueryListener) {
    const index = this.listeners.indexOf(listener);

    if (index !== -1) {
      this.listeners.splice(index, 1);
    }
  }

  public get matches() {
    return matches(this.media.type, this.media.value, this.dimensions);
  }

  private update() {
    this.listeners.forEach(listener => listener(this));
  }

  public unsubscribe() {
    Dimensions.removeEventListener('change', this.dimensionsListener);
  }
}
