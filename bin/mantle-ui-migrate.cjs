#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const PACKAGE_NAME = '@mantle-ui/react';
const FILE_EXTENSIONS = new Set(['.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs', '.mts', '.cts', '.d.ts']);
const IGNORED_DIRECTORIES = new Set([
    '.git',
    '.hg',
    '.next',
    '.turbo',
    '.yarn',
    'coverage',
    'dist',
    'build',
    'out',
    'node_modules'
]);

function parseArgs(argv) {
    const normalizedArgv = argv[0] === 'migrate' ? argv.slice(1) : argv;
    const args = {
        cwd: process.cwd(),
        dryRun: false
    };

    for (let i = 0; i < normalizedArgv.length; i++) {
        const arg = normalizedArgv[i];

        if (arg === '--dir') {
            args.cwd = path.resolve(normalizedArgv[++i]);
        } else if (arg === '--dry-run') {
            args.dryRun = true;
        } else if (arg === '--help' || arg === '-h') {
            printHelp();
            process.exit(0);
        } else {
            console.error(`Unknown argument: ${arg}`);
            printHelp();
            process.exit(1);
        }
    }

    return args;
}

function printHelp() {
    console.log(`mantle-ui-migrate

Rewrites PrimeReact imports to Mantle UI.

Usage:
  mantleui migrate [--dir <path>] [--dry-run]
  mantle-ui-migrate [--dir <path>] [--dry-run]

Options:
  --dir <path>    Target project directory. Defaults to current working directory.
  --dry-run       Show what would change without writing files.
  --help, -h      Show this help message.
`);
}

function shouldProcessFile(filePath) {
    if (filePath.endsWith('.d.ts')) {
        return true;
    }

    return FILE_EXTENSIONS.has(path.extname(filePath));
}

function walk(directory, files) {
    const entries = fs.readdirSync(directory, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(directory, entry.name);

        if (entry.isDirectory()) {
            if (!IGNORED_DIRECTORIES.has(entry.name)) {
                walk(fullPath, files);
            }

            continue;
        }

        if (entry.isFile() && shouldProcessFile(fullPath)) {
            files.push(fullPath);
        }
    }
}

function rewriteImports(source) {
    let updated = source;

    updated = updated.replace(/(['"])primereact\/resources\//g, `$1${PACKAGE_NAME}/resources/`);
    updated = updated.replace(/(['"])primereact\//g, `$1${PACKAGE_NAME}/`);
    updated = updated.replace(/(['"])primereact(['"])/g, `$1${PACKAGE_NAME}$2`);

    return updated;
}

function updateSourceFiles(cwd, dryRun) {
    const files = [];

    walk(cwd, files);

    let changedFiles = 0;

    for (const filePath of files) {
        const original = fs.readFileSync(filePath, 'utf8');
        const updated = rewriteImports(original);

        if (updated !== original) {
            changedFiles++;

            if (!dryRun) {
                fs.writeFileSync(filePath, updated, 'utf8');
            }
        }
    }

    return changedFiles;
}

function run(argv = process.argv.slice(2)) {
    const args = parseArgs(argv);

    if (!fs.existsSync(args.cwd)) {
        console.error(`Directory does not exist: ${args.cwd}`);
        process.exit(1);
    }

    const changedFiles = updateSourceFiles(args.cwd, args.dryRun);

    console.log(`Rewrote imports in ${changedFiles} file(s).`);
}

function main() {
    run();
}

module.exports = {
    main,
    run
};

if (require.main === module) {
    main();
}
