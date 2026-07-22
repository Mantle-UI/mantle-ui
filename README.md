[![npm](https://img.shields.io/npm/v/@mantle-ui/react?label=%40mantle-ui%2Freact&logo=npm)](https://www.npmjs.com/package/@mantle-ui/react)
[![npm downloads](https://img.shields.io/npm/dm/@mantle-ui/react)](https://www.npmjs.com/package/@mantle-ui/react)
[![License: MIT](https://img.shields.io/badge/license-MIT-yellow.svg)](LICENSE)

<p align="center">
  <a href="https://mantle-ui.github.io/mantle-ui/">
    <img
      src="https://github.com/Mantle-UI/mantle-ui/raw/main/public/images/mantle-logo-text.png"
      alt="Mantle UI"
    />
  </a>
</p>

<p align="center">
  A community-maintained continuation of the MIT-licensed PrimeReact v10 component library.
</p>

<p align="center">
  <a href="https://mantle-ui.github.io/mantle-ui/">Documentation</a>
  ·
  <a href="https://www.npmjs.com/package/@mantle-ui/react">npm</a>
  ·
  <a href="https://github.com/Mantle-UI/mantle-ui/releases">Releases</a>
  ·
  <a href="https://github.com/Mantle-UI/mantle-ui/issues">Issues</a>
  ·
  <a href="https://github.com/Mantle-UI/mantle-ui/discussions">Discussions</a>
  ·
  <a href="https://discord.gg/BGs6EkpnDv">Discord</a>
  ·
  <a href="https://opencollective.com/mantle-ui">Open Collective</a>
</p>

# Mantle UI

Mantle UI is an independent, community-maintained React UI component library based on the MIT-licensed [PrimeReact v10](https://github.com/primefaces/primereact) codebase.

The project exists to provide PrimeReact v10 users with a stable, open-source path forward. Mantle UI preserves the familiar component APIs and development model while continuing maintenance, bug fixes, accessibility improvements, documentation, and compatibility work in the open.

Mantle UI is not affiliated with PrimeTek, PrimeReact, or ngrok.

## Why Mantle UI?

- Community-driven and independently maintained
- Based on the established PrimeReact v10 codebase
- Published under the MIT License
- More than 80 React UI components
- Styled and unstyled modes
- Available on npm
- Includes an automated migration CLI
- Developed transparently on GitHub

## Installation

Install Mantle UI using your preferred package manager:

```bash
npm install @mantle-ui/react
```

```bash
pnpm add @mantle-ui/react
```

```bash
yarn add @mantle-ui/react
```

```bash
bun add @mantle-ui/react
```

## Basic Usage

Components can be imported individually:

```tsx
import { Button } from '@mantle-ui/react/button';

export default function Example() {
    return <Button label="Mantle UI" />;
}
```

See the [documentation](https://mantle-ui.github.io/mantle-ui/) for component examples, APIs, theming, and configuration.

## Migrating from PrimeReact

Mantle UI includes a migration CLI that rewrites source imports from `primereact` to `@mantle-ui/react`.

The migration only updates source imports. It does not modify `package.json` or lockfiles.

### 1. Install Mantle UI

```bash
npm install @mantle-ui/react
```

### 2. Preview the migration

Run the migration in dry-run mode first:

```bash
npm exec mantleui migrate -- --dry-run
```

### 3. Apply the migration

```bash
npm exec mantleui migrate
```

The CLI is also available with pnpm and Yarn:

```bash
pnpm exec mantleui migrate
yarn mantleui migrate
```

You can also run it directly without installing the package first:

```bash
npx --package @mantle-ui/react mantleui migrate
```

To migrate a different project directory:

```bash
npm exec mantleui migrate -- --dir ./my-app
```

After running the CLI, review the generated changes and test your application before deploying them.

## Theming

Mantle UI supports styled and unstyled usage.

### Styled mode

Import a theme and the core Mantle UI stylesheet:

```tsx
import '@mantle-ui/react/resources/themes/lara-light-cyan/theme.css';
import '@mantle-ui/react/resources/mantle-ui-react.css';
```

### Unstyled mode

Unstyled mode allows components to be used without the default component styling. It can be enabled globally through the Mantle UI context.

See the [theming documentation](https://mantle-ui.github.io/mantle-ui/) for details.

## Project Status

Mantle UI is under active community development.

The current focus is on:

- maintaining compatibility for existing PrimeReact v10 users
- reviewing and resolving inherited issues
- fixing bugs and improving stability
- improving accessibility
- keeping the library compatible with the modern React ecosystem
- improving documentation and migration guidance
- building a sustainable contributor community

Please review the latest [releases](https://github.com/Mantle-UI/mantle-ui/releases) before adopting Mantle UI in production.

## Reporting Bugs

Before opening an issue:

1. Search the existing [issues](https://github.com/Mantle-UI/mantle-ui/issues).
2. Confirm that the problem occurs with the latest Mantle UI release.
3. Provide a minimal reproduction whenever possible.
4. Include your Mantle UI, React, browser, and package-manager versions.

Use GitHub Issues for reproducible bugs and clearly defined implementation tasks.

For usage questions, ideas, feedback, and general conversation, use [GitHub Discussions](https://github.com/Mantle-UI/mantle-ui/discussions) or join our [Discord community](https://discord.gg/BGs6EkpnDv).

## Contributing

Contributions are welcome.

You can help by:

- reporting and reproducing bugs
- reviewing inherited PrimeReact v10 issues
- improving documentation
- fixing accessibility problems
- submitting code changes
- testing releases
- answering community questions

Before starting substantial work, please open or join an issue so the proposed approach can be discussed.

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for development setup, contribution guidelines, and the pull request process.

## Funding

Mantle UI is developed and maintained by the community.

Financial support helps fund ongoing development, maintenance, bug fixes, accessibility improvements, documentation, infrastructure, contributor work, and community initiatives.

You can support the project through [Open Collective](https://opencollective.com/mantle-ui).

Mantle UI is fiscally hosted by the [Open Source Collective](https://oscollective.org/).

See [FUNDING.md](FUNDING.md) for details about funding, expenses, transparency, and sponsored development.

## License

Mantle UI is available under the [MIT License](LICENSE).

The project is derived from the MIT-licensed PrimeReact v10 codebase. Relevant copyright and attribution notices are preserved in accordance with the license.

## Community

- [Documentation](https://mantle-ui.github.io/mantle-ui/)
- [GitHub Discussions](https://github.com/Mantle-UI/mantle-ui/discussions)
- [Discord](https://discord.gg/BGs6EkpnDv)
- [Open Collective](https://opencollective.com/mantle-ui)

## Contributors

<a href="https://github.com/Mantle-UI/mantle-ui/graphs/contributors">
  <img
    src="https://contrib.rocks/image?repo=Mantle-UI/mantle-ui"
    alt="Mantle UI contributors"
  />
</a>
