import { NamedStyles, Props } from '../types';

type AnonymousDefinition<T> = NamedStyles<T>;
type NamedDefinition<T> = {
  prop: string;
  variants: NamedStyles<T>;
};
type VariantDefinition<T> = AnonymousDefinition<T> | NamedDefinition<T>;

/**
 * Checks if variant definition is in simple format.
 */
const isAnonymousDefinition = <T>(defs: VariantDefinition<T>): defs is AnonymousDefinition<T> =>
  !('prop' in defs && 'variants' in defs);

/**
 * Unify variant definition.
 */
const deanonymize = <T>(defs: AnonymousDefinition<T>): NamedDefinition<T> => ({
  prop: 'variant',
  variants: defs,
});

export function variants<T extends NamedStyles<any>>(defs: NamedDefinition<T>): T;
export function variants<T extends NamedStyles<any>>(defs: AnonymousDefinition<T>): T;
export function variants<T extends NamedStyles<any>>(
  defs: Array<AnonymousDefinition<T> | NamedDefinition<T>>
): T;

/**
 * Adds variants definition to the style object.
 */
export function variants<T extends NamedStyles<any>>(
  defs: VariantDefinition<T> | Array<AnonymousDefinition<T> | NamedDefinition<T>>
): T {
  const temp: NamedStyles<any> = {};
  const defsArray = (Array.isArray(defs) ? defs : [defs]).map(d =>
    isAnonymousDefinition(d) ? deanonymize(d) : d
  );

  for (const def of defsArray) {
    for (const variant in def.variants) {
      temp[getVariantKey(def.prop, variant)] = def.variants[variant];
    }
  }

  return temp as T;
}

/**
 * Flatten variants into the main styles object.
 */
export const flattenVariants = <T extends NamedStyles<T>>(styles: any, component: string): void => {
  const variantsKeys = Object.keys(styles[component]).filter(isVariantKey);

  for (let variantKey of variantsKeys) {
    const { prop, variant } = getVariantDetailsFromKey(variantKey);

    Object.defineProperty(styles, getVariantKey(prop, variant, component), {
      enumerable: true,
      value: styles[component][variantKey],
    });

    delete styles[component][variantKey];
  }
};

/**
 * Compose main style keys with variants.
 */
export const compileVariants = <T extends NamedStyles<T>>(
  styles: NamedStyles<any>,
  props: Props
) => {
  const copy = { ...styles };
  const variantKeys = Object.keys(styles).filter(isVariantKey);

  for (let variantKey of variantKeys) {
    const { component, prop, variant } = getVariantDetailsFromKey(variantKey);

    const stringPropValue = String(props[prop]);

    if (stringPropValue === variant) {
      if (!Array.isArray(copy[component])) {
        // @ts-ignore
        copy[component] = [copy[component], copy[variantKey]];
      } else {
        // @ts-ignore
        copy[component].push(copy[variantKey]);
      }
    }
  }

  return copy as T;
};

/**
 * Generate variant key.
 */
export const getVariantKey = (prop: string, variant: string, component?: string) => {
  return ['_var', prop, variant, component].filter(v => v !== undefined).join(':');
};

/**
 * Get component and variant name details from key.
 */
const getVariantDetailsFromKey = (key: string) => {
  const [prop, variant, component] = key.split(':').slice(1);

  return { prop, variant, component };
};

/**
 * Checks if style definition contains variants.
 */
export const hasVariants = (obj: any) => Object.keys(obj).some(isVariantKey);
export const isVariantKey = (key: string) => key.match(/^_var:/);
