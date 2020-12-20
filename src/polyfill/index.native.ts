import { MediaQueryList } from '../media/MediaQueryList';

// @ts-ignore
if (typeof window !== 'undefined') {
  // @ts-ignore
  window.matchMedia = (query: string) => new MediaQueryList(query);
}
