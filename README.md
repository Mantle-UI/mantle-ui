[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub](https://img.shields.io/badge/GitHub-Mantle--UI%2Fmantle--ui-181717?logo=github)](https://github.com/Mantle-UI/mantle-ui)
[![npm package](https://img.shields.io/badge/npm-%40mantle--ui%2Freact-CB3837?logo=npm)](https://www.npmjs.com/package/@mantle-ui/react)

[![Mantle UI](https://github.com/Mantle-UI/mantle-ui/raw/main/public/images/mantle-logo-text.png)](https://github.com/Mantle-UI/mantle-ui)

# Mantle UI

Mantle UI is an independent community-maintained React component library continued from the MIT-licensed [PrimeReact v10](https://github.com/primefaces/primereact) codebase.

Mantle UI is not affiliated with PrimeTek, PrimeReact, or ngrok.

## Download

Mantle UI is published as [`@mantle-ui/react`](https://www.npmjs.com/package/@mantle-ui/react).

For local package testing, build the library first and pack the publishable output from `dist/` rather than packing the repository root.

```
# Using npm
npm install @mantle-ui/react

# Using yarn
yarn add @mantle-ui/react

# Using pnpm
pnpm add @mantle-ui/react

# Using bun
bun install @mantle-ui/react
```

## Import

Each component can be imported individually so that you only bundle what you use. Import path is available in the documentation of the corresponding component.

```javascript
// import { ComponentName } from '@mantle-ui/react/{componentname}';
import { Button } from '@mantle-ui/react/button';

export default function MyComponent() {
    return <Button label="Mantle UI" />;
}
```

## Theming

Mantle UI has two theming modes; styled or unstyled.

**Styled Mode**

Styled mode is based on pre-skinned components with opinionated themes. Import the theme and core styles from the package resources.

```javascript
// theme
import '@mantle-ui/react/resources/themes/lara-light-cyan/theme.css';
import '@mantle-ui/react/resources/mantle-ui-react.css';
```

**Unstyled Mode**

Unstyled mode is disabled by default for all components. Using the Mantle UI context, set `unstyled` as true to enable it globally.

## Migration From PrimeReact

Mantle UI includes a migration CLI that rewrites `primereact` imports to `@mantle-ui/react`. It only updates source imports and does not modify `package.json` or lockfiles.
The CLI is included in the published package and in the built `dist/` package output.

If `@mantle-ui/react` is already installed in the project, run it from the project root with your package manager:

```bash
npm exec mantleui migrate
pnpm exec mantleui migrate
yarn mantleui migrate
```

Without installing first, you can run it directly from the published package:

```bash
npx --package @mantle-ui/react mantleui migrate
```

Useful options:

```bash
# target a different project directory
npm exec mantleui migrate -- --dir ./my-app

# preview changes without writing files
npm exec mantleui migrate -- --dry-run
```

If you copy the script into another project manually, keep the `.cjs` extension so it also works in projects using `"type": "module"`.

## Publishing

Adjust the version in the `package.json` run `npm i` and if necessary and commit files.
Then simply "Publish a Release" on GitHub and the workflow will handle publishing to NPM based on the tag `v10.x.x`

## Contributors

<a href="https://github.com/Mantle-UI/mantle-ui/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=Mantle-UI/mantle-ui" />
</a>
