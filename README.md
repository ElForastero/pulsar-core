![logo](assets/logo_text.svg)

@pulsar/core
---

![npm](https://img.shields.io/npm/v/@pulsar/core)
![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)

> Handy style utilities for React Native and React Native Web.

- 📦 Lightweight (~2 KB)
- 🚀 Fast (main work happens outside of component)
- 👌 No dependencies
- 👮‍♂️ Typed with TypeScript
- ⚛️ Supports both Native and Web

## What it looks like

```tsx
import { DynamicStyleSheet, variants, maxWidth } from '@pulsar/core';

// Use `DynamicStyleSheet` in place of `StyleSheet`.
// It accepts a function whose first argument is a theme object,
// and returns styles as it does regular `StyleSheet`.
const useStyles = DynamicStyleSheet.create(theme => ({
  button: {
    borderRadius: theme.radii.ios,
    // You can define any component variations with `variants` helper.
    ...variants({
      primary: {
        backgroundColor: theme.colors.primary
      },
      secondary: {
        backgroundColor: theme.colors.secondary
      }
    }),
    // Media-queries can be used as well.
    ...maxWidth(theme.breakpoints.tablet, {
      height: 50
    })
  }
}));

const Button = ({ children, variant }) => {
  // `DynamicStyleSheet` return a custom react hook.
  // It has optional parameter - props from which depends variants described above.
  const styles = useStyles({ variant });

  return (
    // styles.button here is an array of compined styles
    <View style={styles.button}>{children}</View>
  );
};
```

## How is it different?

`@pulsar/core` doesn't call `StyleSheet.create()` during components rendering. All variants and media queries are
flattened into main object and styles are created once during calling of `DynamicStyleSheet.create()`.

The result looks like this:

```ts
// {
//   'button': {},
//   '_var:variant:primary:button': {},
//   '_var:variant:secondary:button': {},
//   '_media:max-width:768:button': {},
// }
```

Instead of calling `StyleSheet.create()` during rendering, the custom hook returned from `DynamicStyleSheet.create()`
just manipulates with already existing and transpiled styles.

In the case above `styles.button` will contain an array of
styles `[styles['button'], styles['_var:variant:primary:button'], styles['_media:max-width:768:button']]`. So you don't
have to worry about merging all those keys together.

## Installation

```sh
yarn add @pulsar/core
yarn add --dev babel-plugin-preval
```

Add `babel-plugin-preval` to your babel config. Please note that `preval` plugin should be listed first in plugins
array ([details](https://github.com/kentcdodds/babel-plugin-preval#installation)):

```js
module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: ['preval'],
};
```

## Configuring

1. Import media-queries polyfill in the root of your app. Typically `index.ts`. It's required to emulate media queries
   in RN.

```ts
import '@pulsar/core/dist/polyfill';
```

2. Overwrite `Theme` interface with your theme shape to enable properties validation and autocomplete. Create a `.d.ts`
   file, e.g. `pulsar__core.d.ts`.

```ts
// pulsar__core.d.ts

import '@pulsar/core';

declare module '@pulsar/core' {
  export interface Theme {
    // You can define any properties you want.
    breakpoints: {
      phone: 320,
      tablet: 768,
      desktop: 1280
    },
    colors: {
      primary: string,
      secondary: string,
    }
  }
}
```

Then define your light and dark themes using `Theme` interface.

```ts
// themes/themes.ts
import { Theme } from '@pulsar/core';

export const light: Theme = {
  breakpoints: {},
  colors: {}
}
```

3. Wrap your app in `<ThemeProvider />`, passing light and dark themes as value. It's required to access the current
   theme via `useTheme()` hook.

```tsx
import { ThemeProvider } from '@pulsar/core';
import { lightTheme, darkTheme } from './path/to/your/themes';

const pulsarConfig = {
  light: lightTheme,
  dark: darkTheme,
}

const App = () => (
  <ThemeProvider value={pulsarConfig}>
    {/* the rest of your app */}
  </ThemeProvider>
)
```

4. Create `.pulsar.config.js` config file in the root of your project. This config should export light and dark themes
   and follow the following shape:

```js
// .pulsar.config.js
module.exports = {
  themes: {
    light: { /* your theme definition here */ },
    dark: { /* your theme definition here */ },
  }
}
```

Or if you have your themes defined somewhere in `src` code, you can just re-export them to pulsar. E.g:

```js
// .pulsar.config.js
const { light } = require('./src/themes/light');
const { dark } = require('./src/themes/dark');

module.exports = {
  themes: { light, dark },
};

```

## Usage

Typical usage of `@pulsar/core` look like this:

```tsx
import { DynamicStyleSheet, variants } from '@pulsar/core';

const useStyles = DynamicStyleSheet.create(theme => ({
  button: {
    borderRadius: 8,
    ...variants({
      primary: {
        backgroundColor: theme.colors.primary
      },
      secondary: {
        backgroundColor: theme.colors.secondary
      }
    })
  },
}));

const Button = ({ children, variant }) => {
  const styles = useStyles({ variant });

  return (
    <View style={s.button}>{children}</View>
  )
};
```

## Variants

Variants allow defining different component states dependent on its props.

```ts
import { DynamicStyleSheet, variants } from '@pulsar/core';

DynamicStyleSheet.create(theme => ({
  button: {
    // Define button size variants
    ...variants({
      prop: 'size',
      variants: {
        small: {
          height: 30,
        },
        normal: {
          height: 40,
        },
        large: {
          height: 50,
        },
      }
    }),
    // Shorthand for `prop = 'variant'`
    ...variants({
      primary: {
        color: theme.colors.primary,
      },
      secondary: {
        color: theme.cosors.secondary,
      },
      tertiary: {
        color: theme.cosors.tertiary,
      }
    }),
    // Arrays can be used as well
    ...variants([
      {
        prop: 'variant', variants: {}
      },
      {
        prop: 'size', variants: {}
      },
    ]),
  }
}));
```

## Media Queries

Available media-queries:

- minWidth
- maxWidth
- minHeight
- maxHeight

```ts
import { DynamicStyleSheet, maxWidth } from '@pulsar/core';

DynamicStyleSheet.create(() => ({
  button: {
    alignSelf: 'flex-start',
    ...minWidth(768, {
      alignSelf: 'stretch'
    });
  }
}));
```
