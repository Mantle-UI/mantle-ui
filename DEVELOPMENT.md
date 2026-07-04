## Local Development

This repository currently has two separate workflows:

- a legacy Next.js docs app used for the existing documentation site
- a Rollup + Gulp library packaging pipeline used to publish
  `@mantle-ui/react`

Mantle UI may move more of this workflow to Vite later, but for now the goal
is to keep the current package build working while making it easier to
understand.

## Prerequisites

- Node.js `>= 18`
- npm

Install dependencies from the repository root:

```shell
npm install --legacy-peer-deps
```

`--legacy-peer-deps` is currently required because the dependency metadata for
`jspdf` and `jspdf-autotable` does not satisfy npm's default peer resolution.

## Docs App Workflow

The docs app still uses Next.js.

Start the docs app in development mode:

```shell
npm run dev:docs
```

Build the docs app:

```shell
npm run build:docs
```

Run the built docs app:

```shell
npm run start:docs
```

The legacy aliases still exist:

- `npm run dev`
- `npm run build`
- `npm run start`

## Library Packaging Workflow

The publishable library artifacts are built into `dist/`.

### Cross-platform build

```shell
INPUT_DIR=components/lib/ OUTPUT_DIR=dist/ NODE_ENV=production npm run build:dist
```

### Windows build

```shell
npm run build:lib:windows
```

### Unix-like build

```shell
npm run build:lib
```

These scripts perform:

1. linting, formatting, and type checks
2. Rollup bundling
3. Gulp resource copying and CSS packaging
4. API docs and web types generation

## Build Script Reference

- `npm run build:bundle`
  Runs the Rollup library bundle only.
- `npm run build:assets`
  Runs the Gulp asset/resource packaging only.
- `npm run build:api`
  Generates API documentation and web types.
- `npm run build:dist`
  Runs the full library packaging pipeline.
- `npm run build:dist:watch`
  Runs the packaging pipeline and leaves Rollup in watch mode.
- `npm run build:verify`
  Runs the repository verification gate, including `security:check`.

## Recommended Usage

- `npm run build:lib:windows`
  Use this when you want to build the publishable Mantle UI package into
  `dist/` on Windows.
- `npm run build:lib`
  Use this when you want the same package build on Unix-like systems.
- `npm run build:verify`
  Use this when you want the extra verification gate before release work,
  especially the audit check.

## Developing the Library Against Another App

If you want to test Mantle UI inside another project, build the library to
`dist/` first.

For now, local linking is not fully standardized in this document. If your
downstream app already uses Vite, the simplest approach is usually to consume
the built output from `dist/` or use your preferred local package linking
workflow.

If the team wants a standard local linking path later, document that
separately once the package build is stabilized.

## Known Build Notes

- The current docs app is still Next.js-based even if downstream consumers use
  Vite.
- The packaging flow still uses Rollup and Gulp.
- Some filenames and internal build details still reflect the inherited
  PrimeReact v10 structure and are being cleaned up incrementally.
