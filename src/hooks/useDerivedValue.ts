import { Dimensions, ScaledSize } from 'react-native';
import { useEffect, useRef, useState } from 'react';

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

    const subscription = Dimensions.addEventListener('change', listener);

    // @ts-expect-error https://github.com/DefinitelyTyped/DefinitelyTyped/pull/55354
    return subscription.remove;
  }, []);

  return valueRef.current;
};
