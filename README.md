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

## Releasing

Mantle UI uses a manual GitHub Actions release workflow. Maintainers do not edit the version by hand and do not publish to npm directly from a local machine.

Start the `Release` workflow from GitHub Actions on the `main` branch. The workflow will:

- inspect merged pull requests since the latest Git tag
- resolve linked issues from both PR body references like `fixes #123` and GitHub-linked issue relationships
- calculate the next version automatically
- update `package.json` and `package-lock.json`
- commit the release as `chore(release): vX.Y.Z`
- create and push the `vX.Y.Z` tag
- create the GitHub Release

The existing npm publish workflow is triggered by that GitHub Release and publishes `@mantle-ui/react` via trusted publishing.

Before the workflow does any release work, it checks `github.actor` against the `RELEASE_ALLOWED_ACTORS` repository variable. Configure that variable as a comma-separated or newline-separated list of allowed GitHub usernames.
The release job is also attached to the protected `release` environment, so GitHub environment rules and reviewers are enforced before the job proceeds.
The workflow pushes and creates the release as a dedicated GitHub App, not as `github-actions[bot]`. Configure the app before first use:

- create and install a GitHub App for this repository
- grant it at least `Contents: Read & Write`, `Pull requests: Read`, and `Issues: Read`
- add that GitHub App to the `main` ruleset bypass list
- set repository variable `RELEASE_APP_CLIENT_ID`
- set repository secret `RELEASE_APP_PRIVATE_KEY`

### Release Version Rules

- `breaking-change` label on the PR or on any linked issue => major release
- linked issue type `feature` => minor release
- linked issue type `bug` => patch release

Priority is:

```txt
breaking-change > feature > bug
```

If no relevant release signal exists since the latest tag, the release workflow fails without creating a release.

### PR Linking Convention

To make release detection reliable, pull requests should either:

- include closing references in the PR body, for example `Fixes #123`
- or be linked to issues using GitHub's linked issue relationship

The PR title does not affect version calculation.

## Contributors

<a href="https://github.com/Mantle-UI/mantle-ui/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=Mantle-UI/mantle-ui" />
</a>
