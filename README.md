@pulsar/core
---

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](#)

> Handy style utilities for React Native and React Native Web.
> 
![screenshot](assets/screenshot.png)

- 📦 Lightweight (~2 KB)
- 🚀 Fast (main work happens outside of component)
- 👌 No dependencies
- 👮‍♂️ Typed with TypeScript
- ⚛️ Supports both Native and Web

![@pulsar/ui logo](assets/logo.svg)

- [Installation](#Install)
- [Configuration](#Configure)
- [Usage](#Usage)

## Install

```sh
yarn add @pulsar/core
```

## Configure

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

4. Redeclare locally `DynamicStyleSheet` setting light and dark themes of your app. This step is essential and required
   to be able to precompile styles object outside of components render cycle. Inside components theme can be accessed
   via context API, but outside of components this is the only way to pre-setup ES modules.

```ts
// utils/DynamicStyleSheet.ts
import { DynamicStyleSheet } from '@pulsar/core';
import { light, dark } from './path/to/themes';

DynamicStyleSheet.lightTheme = light;
DynamicStyleSheet.darkTheme = dark;

export { DynamicStyleSheet };
```

Later use this redeclared `DynamicStyleSheet` everywhere in your app.

## Usage

Typical usage of `@pulsar/core` look like this:

```tsx
import { variants } from '@pulsar/core';
import { DynamicStyleSheet } from 'utils/DynamicStyleSheet';

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
DynamicStyleSheet.create(theme => ({
  button: {
    // Define button size variants
    ...variants({
      prop: 'size',
      variants: {
        sm: { /* ... */ },
        xl: { /* ... */ },
      }
    }),
    // Shorthand for `prop = 'variant'`
    ...variants({
      primary: { /* ... */ },
      secondary: { /* ... */ },
      tertiary: { /* ... */ }
    }),
    // Arrays can be used as well
    ...variants([
      {
        prop: 'variant', variants: { /* ... */ }
      },
      {
        prop: 'size', variants: { /* ... */ }
      },
    ]),
  }
}));
```
