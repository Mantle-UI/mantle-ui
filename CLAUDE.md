# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Mantle UI (`@mantle-ui/react`) is an independent, community-maintained React component library continued from the MIT-licensed PrimeReact v10 codebase. It is not affiliated with PrimeTek, PrimeReact, or ngrok. Internal CSS classes, data attributes, and some file/API naming still reflect the inherited `p-*` / PrimeReact structure and are being cleaned up incrementally — don't be surprised by that legacy naming.

The repository has **two separate build workflows** living side by side:

1. A Next.js docs/demo site (`pages/`, `components/doc`, `components/demo`, `components/layout`) — this is what's deployed as the public documentation site.
2. A Rollup + Gulp packaging pipeline (`rollup.config.js`, `gulpfile.js`) that builds the publishable `@mantle-ui/react` package into `dist/` from `components/lib/`.

Install dependencies with `npm install --legacy-peer-deps` (required because `jspdf`/`jspdf-autotable` peer metadata doesn't satisfy npm's default resolver).

## Common Commands

```shell
# Docs site (Next.js)
npm run dev:docs                # start docs app in dev mode
npm run build:docs              # build docs app
npm run start:docs               # run built docs app
# `dev`, `build`, `start` are legacy aliases for the three above

# Linting / formatting / types
npm run lint                    # eslint on components, pages, service, api-scripts (--max-warnings=0)
npm run lint:fix
npm run format                  # prettier --write
npm run format:check
npm run type:check              # tsc -p ./api-scripts/tsconfig.json
npm run build:check             # lint + format:check + type:check
npm run build:verify            # build:check + security:check (npm audit, prod deps, critical)

# Tests (Jest + React Testing Library, jsdom, snapshot-based)
npm test                        # watch mode, coverage, silent
npm run test:check              # single run, non-interactive (use this for CI-style checks)
npm run test:debug              # watch mode without --silent
npx jest components/lib/button/Button.spec.js   # run a single component's tests
npx jest -t "when visible is false"             # run tests matching a name

# Library packaging (builds components/lib -> dist/)
npm run build:lib:windows       # Windows: full package build
npm run build:lib               # Unix: full package build
npm run build:bundle            # rollup only
npm run build:assets            # gulp resource/CSS copying only
npm run build:api               # apiwebtypes + apidoc generation only
npm run build:dist:watch        # full pipeline, leaves rollup in watch mode
```

## Architecture

### Component packages (`components/lib/<name>/`)

Each of the ~118 directories under `components/lib/` is an independently publishable sub-package of `@mantle-ui/react` (e.g. `@mantle-ui/react/button`). A typical component directory contains:

- `ComponentName.js` — the actual React component (forwardRef, functional).
- `ComponentNameBase.js` — `ComponentBase.extend({...})` call defining `defaultProps` and the `css` classes/inlineStyles object used for styled-mode class names.
- `componentname.d.ts` — TypeScript declarations, hand-authored (this is what `npm run type:check` and `apiwebtypes` validate/consume).
- `ComponentName.spec.js` — Jest snapshot tests using the shared helpers from `components/test`.
- `package.json` — publish metadata only (`main`/`module`/`unpkg`/`types` pointing at the built `dist/` bundle filenames for that sub-package).

Within `components/lib`, components import shared internals via **relative paths** (e.g. `../../componentbase/ComponentBase`, `../hooks/Hooks`, `../utils/Utils`). During the Rollup build, `rollup.config.js` rewrites a large fixed alias table of these relative paths to their public package-specifier form (`@mantle-ui/react/componentbase`, `@mantle-ui/react/hooks`, etc.) so each sub-package's bundle references its sibling packages instead of inlining them. When adding a new shared dependency between components, it generally needs a corresponding alias entry in `rollup.config.js`.

Core shared modules every component builds on:

- `components/lib/componentbase/ComponentBase.js` — the passthrough (`pt`)/unstyled-mode engine (`extend()`, `getPTValue`, `useHandleStyle`, `cx`/`sx`/`ptm` helpers) that every component's `*Base.js` and component file consume for theming, style injection, and PrimeReact-style passthrough props.
- `components/lib/api/Api.js` — `MantleContext`/`MantleProvider`, global config (locale, unstyled, pt, filter match modes, etc.).
- `components/lib/hooks/Hooks.js` — re-exports the internal hooks (`useMountEffect`, `useUpdateEffect`, `useStyle`, `useOverlayListener`, etc.) used throughout `components/lib`.
- `components/lib/utils/Utils.js` — `ObjectUtils`, `classNames`, `mergeProps`, and other shared helpers.

### Docs site (`pages/`, `components/doc`, `components/demo`, `components/layout`)

`pages/<component>/index.js` renders the documentation page for a component; the actual doc content/examples usually live in `components/doc/<component>/`. `components/layout` holds the site chrome (topbar, footer, sidebar menu defined in `menu.js`/`menu.json`). `service/*.js` provides static mock data (e.g. `ProductService`, `CustomerService`) consumed by demos. `jsconfig.json` defines `@/components/*`, `@/service/*`, `@/data/*` path aliases used only by the docs app.

### Testing conventions

`components/test/index.js` provides `snapshot(element, name)` and `snapshotParent(element, name)` helpers (render via RTL, assert against a stored snapshot) plus a `userAgent(name)` helper for simulating touch/iOS environments — most `*.spec.js` files are structured as a list of `snapshot(...)` calls wrapping the component in `MantleProvider` with different prop combinations, not conventional assertion-style tests.

### API doc / web-types generation (`api-scripts/`)

`build-apidoc.js` and `build-webtypes.js` walk `components/lib/**/*.d.ts` to generate API documentation and IDE web-types metadata as part of `build:api`. `api-scripts/tsconfig.json` is the config `type:check` runs against — it targets the `.d.ts` files, not full app type-checking.

## Coding Conventions

Full detail is in `CODING_STANDARDS.md`; the actual enforced formatting comes from `.prettierrc.json` (4-space indent via spaces, single quotes, semicolons required, no trailing commas, 250-char print width) and `.eslintrc.json` (`next/core-web-vitals` + `@typescript-eslint/recommended`, `no-console` as an error, enforced blank lines around blocks/`return`/declarations). Notable project preferences beyond standard lint/format:

- Prefer named exports over default exports.
- Prefer functional components; avoid inline `style={{...}}` in favor of class-based styling (see the `cx`/`css.classes` pattern in `*Base.js` files).
- Import order: React, then external libraries (alphabetical), then absolute project imports (alphabetical), then relative imports (alphabetical).
- Group multiple related parameters into a single object once a function needs more than ~4 arguments.
