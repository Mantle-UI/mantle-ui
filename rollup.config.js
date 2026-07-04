import alias from '@rollup/plugin-alias';
import { babel } from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import postcss from 'rollup-plugin-postcss';
import { terser } from 'rollup-plugin-terser';

import fs from 'fs-extra';
import path from 'path';

import pkg from './package.json';

let entries = [];

let core = {};

const NPM_LINK = process.env.NPM_LINK === 'true';

// alias entries
const ALIAS_ICON_COMPONENT_ENTRIES = [
    { find: '../../iconbase/IconBase', replacement: '@mantle-ui/react/iconbase' },
    { find: '../icons/angledoubledown', replacement: '@mantle-ui/react/icons/angledoubledown' },
    { find: '../icons/angledoubleleft', replacement: '@mantle-ui/react/icons/angledoubleleft' },
    { find: '../icons/angledoubleright', replacement: '@mantle-ui/react/icons/angledoubleright' },
    { find: '../icons/angledoubleup', replacement: '@mantle-ui/react/icons/angledoubleup' },
    { find: '../icons/angledown', replacement: '@mantle-ui/react/icons/angledown' },
    { find: '../icons/angleleft', replacement: '@mantle-ui/react/icons/angleleft' },
    { find: '../icons/angleright', replacement: '@mantle-ui/react/icons/angleright' },
    { find: '../icons/angleup', replacement: '@mantle-ui/react/icons/angleup' },
    { find: '../icons/arrowdown', replacement: '@mantle-ui/react/icons/arrowdown' },
    { find: '../icons/arrowup', replacement: '@mantle-ui/react/icons/arrowup' },
    { find: '../icons/ban', replacement: '@mantle-ui/react/icons/ban' },
    { find: '../icons/bars', replacement: '@mantle-ui/react/icons/bars' },
    { find: '../icons/calendar', replacement: '@mantle-ui/react/icons/calendar' },
    { find: '../icons/check', replacement: '@mantle-ui/react/icons/check' },
    { find: '../icons/chevrondown', replacement: '@mantle-ui/react/icons/chevrondown' },
    { find: '../icons/chevronleft', replacement: '@mantle-ui/react/icons/chevronleft' },
    { find: '../icons/chevronright', replacement: '@mantle-ui/react/icons/chevronright' },
    { find: '../icons/chevronup', replacement: '@mantle-ui/react/icons/chevronup' },
    { find: '../icons/exclamationtriangle', replacement: '@mantle-ui/react/icons/exclamationtriangle' },
    { find: '../icons/eye', replacement: '@mantle-ui/react/icons/eye' },
    { find: '../icons/eyeslash', replacement: '@mantle-ui/react/icons/eyeslash' },
    { find: '../icons/filter', replacement: '@mantle-ui/react/icons/filter' },
    { find: '../icons/filterslash', replacement: '@mantle-ui/react/icons/filterslash' },
    { find: '../icons/infocircle', replacement: '@mantle-ui/react/icons/infocircle' },
    { find: '../icons/minus', replacement: '@mantle-ui/react/icons/minus' },
    { find: '../icons/pencil', replacement: '@mantle-ui/react/icons/pencil' },
    { find: '../icons/plus', replacement: '@mantle-ui/react/icons/plus' },
    { find: '../icons/refresh', replacement: '@mantle-ui/react/icons/refresh' },
    { find: '../icons/search', replacement: '@mantle-ui/react/icons/search' },
    { find: '../icons/searchminus', replacement: '@mantle-ui/react/icons/searchminus' },
    { find: '../icons/searchplus', replacement: '@mantle-ui/react/icons/searchplus' },
    { find: '../icons/sortalt', replacement: '@mantle-ui/react/icons/sortalt' },
    { find: '../icons/sortamountdown', replacement: '@mantle-ui/react/icons/sortamountdown' },
    { find: '../icons/sortamountupalt', replacement: '@mantle-ui/react/icons/sortamountupalt' },
    { find: '../icons/spinner', replacement: '@mantle-ui/react/icons/spinner' },
    { find: '../icons/star', replacement: '@mantle-ui/react/icons/star' },
    { find: '../icons/starfill', replacement: '@mantle-ui/react/icons/starfill' },
    { find: '../icons/thlarge', replacement: '@mantle-ui/react/icons/thlarge' },
    { find: '../icons/times', replacement: '@mantle-ui/react/icons/times' },
    { find: '../icons/timescircle', replacement: '@mantle-ui/react/icons/timescircle' },
    { find: '../icons/trash', replacement: '@mantle-ui/react/icons/trash' },
    { find: '../icons/undo', replacement: '@mantle-ui/react/icons/undo' },
    { find: '../icons/upload', replacement: '@mantle-ui/react/icons/upload' },
    { find: '../icons/windowmaximize', replacement: '@mantle-ui/react/icons/windowmaximize' },
    { find: '../icons/windowminimize', replacement: '@mantle-ui/react/icons/windowminimize' }
];

const CORE_PASSTHROUGH_DEPENDENCIES = [
    { find: '../passthrough', replacement: '@mantle-ui/react/passthrough' },
    { find: '../passthrough/tailwind', replacement: '@mantle-ui/react/passthrough/tailwind' }
];

const ALIAS_COMPONENT_ENTRIES = [
    { find: '../utils/Utils', replacement: '@mantle-ui/react/utils' },
    { find: '../api/Api', replacement: '@mantle-ui/react/api' },
    { find: '../componentbase/ComponentBase', replacement: '@mantle-ui/react/componentbase' },
    { find: '../hooks/Hooks', replacement: '@mantle-ui/react/hooks' },
    { find: '../ripple/Ripple', replacement: '@mantle-ui/react/ripple' },
    { find: '../csstransition/CSSTransition', replacement: '@mantle-ui/react/csstransition' },
    { find: '../portal/Portal', replacement: '@mantle-ui/react/portal' },
    { find: '../keyfilter/KeyFilter', replacement: '@mantle-ui/react/keyfilter' },
    ...ALIAS_ICON_COMPONENT_ENTRIES,
    { find: '../tooltip/Tooltip', replacement: '@mantle-ui/react/tooltip' },
    { find: '../virtualscroller/VirtualScroller', replacement: '@mantle-ui/react/virtualscroller' },
    { find: '../terminalservice/TerminalService', replacement: '@mantle-ui/react/terminalservice' },
    { find: '../overlayservice/OverlayService', replacement: '@mantle-ui/react/overlayservice' },
    { find: '../checkox/Checkbox', replacement: '@mantle-ui/react/checkbox' },
    { find: '../button/Button', replacement: '@mantle-ui/react/button' },
    { find: '../inputtext/InputText', replacement: '@mantle-ui/react/inputtext' },
    { find: '../inputnumber/InputNumber', replacement: '@mantle-ui/react/inputnumber' },
    { find: '../messages/Messages', replacement: '@mantle-ui/react/messages' },
    { find: '../progressbar/ProgressBar', replacement: '@mantle-ui/react/progressbar' },
    { find: '../dropdown/Dropdown', replacement: '@mantle-ui/react/dropdown' },
    { find: '../dialog/Dialog', replacement: '@mantle-ui/react/dialog' },
    { find: '../paginator/Paginator', replacement: '@mantle-ui/react/paginator' },
    { find: '../tree/Tree', replacement: '@mantle-ui/react/tree' },
    ...CORE_PASSTHROUGH_DEPENDENCIES
];

// dependencies
const GLOBAL_DEPENDENCIES = {
    react: 'React',
    'react-dom': 'ReactDOM',
    'react-transition-group': 'ReactTransitionGroup'
};

const toIifeGlobalName = (moduleName) => {
    if (moduleName.startsWith('@mantle-ui/react/')) {
        return `MantleUI.${moduleName.replace('@mantle-ui/react/', '').replaceAll('/', '.')}`;
    }

    return moduleName.replaceAll('/', '.');
};

const GLOBAL_COMPONENT_DEPENDENCIES = {
    ...GLOBAL_DEPENDENCIES,
    ...(NPM_LINK ? [] : ALIAS_COMPONENT_ENTRIES.reduce((acc, cur) => ({ ...acc, [cur.replacement]: toIifeGlobalName(cur.replacement) }), {}))
};

// externals
const EXTERNAL = ['react', 'react-dom', 'react-transition-group', '@babel/runtime', '@fullcalendar/core', 'chart.js/auto', 'quill'];

const EXTERNAL_COMPONENT = [...EXTERNAL, ...(NPM_LINK ? [] : ALIAS_COMPONENT_ENTRIES.map((entries) => entries.replacement))];

// plugins
const BABEL_PLUGIN_OPTIONS = {
    exclude: 'node_modules/**',
    presets: ['@babel/preset-env', '@babel/preset-react'],
    plugins: ['@babel/plugin-transform-runtime', '@babel/plugin-proposal-class-properties'],
    skipPreflightCheck: true,
    babelHelpers: 'runtime',
    babelrc: false
};

const ALIAS_PLUGIN_OPTIONS_FOR_COMPONENT = {
    entries: ALIAS_COMPONENT_ENTRIES
};

const REPLACE_PLUGIN_OPTIONS = {
    'process.env.NODE_ENV': JSON.stringify('production'),
    preventAssignment: true
};

const RESOLVE_PLUGIN_OPTIONS = {
    extensions: ['.js']
};

const COMMONJS_PLUGIN_OPTIONS = {
    exclude: process.env.INPUT_DIR + '**',
    sourceMap: false
};

const POSTCSS_PLUGIN_OPTIONS = {
    sourceMap: false
};

const TERSER_PLUGIN_OPTIONS = {
    compress: {
        keep_infinity: true,
        pure_getters: true,
        reduce_funcs: false
    }
};

const PLUGINS = [replace(REPLACE_PLUGIN_OPTIONS), resolve(RESOLVE_PLUGIN_OPTIONS), commonjs(COMMONJS_PLUGIN_OPTIONS), babel(BABEL_PLUGIN_OPTIONS), postcss(POSTCSS_PLUGIN_OPTIONS)];

const PLUGINS_COMPONENT = NPM_LINK ? PLUGINS : [alias(ALIAS_PLUGIN_OPTIONS_FOR_COMPONENT), ...PLUGINS];

function addEntry(name, input, output, isComponent = true) {
    const exports = name === 'MantleUI.api' || name === 'MantleUI' ? 'named' : 'auto';
    const useCorePlugin = !NPM_LINK && ALIAS_COMPONENT_ENTRIES.some((entry) => entry.replacement === name.replaceAll('.', '/'));
    const plugins = isComponent ? PLUGINS_COMPONENT : PLUGINS;
    const external = isComponent ? EXTERNAL_COMPONENT : EXTERNAL;
    const inlineDynamicImports = true;

    const onwarn = (warning) => {
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE') {
            return;
        }
    };

    const getEntry = (isMinify) => {
        return {
            onwarn,
            input,
            plugins: [...plugins, isMinify && terser(TERSER_PLUGIN_OPTIONS), useCorePlugin && corePlugin()],
            external,
            inlineDynamicImports
        };
    };

    const get_CJS_ESM = (isMinify) => {
        return {
            ...getEntry(isMinify),
            output: [
                ...(NPM_LINK
                    ? []
                    : [
                          {
                              format: 'cjs',
                              file: `${output}.cjs${isMinify ? '.min' : ''}.js`,
                              exports,
                              banner: "'use client';" // This line is required for SSR.
                          }
                      ]),
                {
                    format: 'esm',
                    file: `${output}.esm${isMinify ? '.min' : ''}.js`,
                    exports,
                    banner: "'use client';" // This line is required for SSR.
                }
            ]
        };
    };

    const get_IIFE = (isMinify) => {
        return {
            ...getEntry(isMinify),
            output: [
                {
                    format: 'iife',
                    name,
                    file: `${output}${isMinify ? '.min' : ''}.js`,
                    globals: isComponent ? GLOBAL_COMPONENT_DEPENDENCIES : GLOBAL_DEPENDENCIES,
                    exports
                }
            ]
        };
    };

    entries.push(get_CJS_ESM());

    if (!NPM_LINK) {
        entries.push(get_IIFE());

        // Minify
        entries.push(get_CJS_ESM(true));
        entries.push(get_IIFE(true));
    }
}

function corePlugin() {
    return {
        name: 'corePlugin',
        generateBundle(outputOptions, bundle) {
            const { name, format } = outputOptions;

            if (format === 'iife') {
                Object.keys(bundle).forEach((id) => {
                    const chunk = bundle[id];
                    const folderName = name.replace('MantleUI.', '').replaceAll('.', '/');
                    const filePath = `./dist/core/core${id.indexOf('.min.js') > 0 ? '.min.js' : '.js'}`;

                    core[filePath] ? (core[filePath][folderName] = chunk.code) : (core[filePath] = { [`${folderName}`]: chunk.code });
                });
            }
        }
    };
}

function addCore() {
    const lastEntry = entries[entries.length - 1];

    lastEntry.plugins = [
        ...lastEntry.plugins,
        {
            name: 'coreMergePlugin',
            generateBundle() {
                Object.entries(core).forEach(([filePath, value]) => {
                    const code = ALIAS_COMPONENT_ENTRIES.reduce((val, entry) => {
                        const name = entry.replacement.replace('@mantle-ui/react/', '');

                        val += value[name] + '\n';

                        return val;
                    }, '');

                    fs.outputFile(path.resolve(__dirname, filePath), code, {}, function (err) {
                        if (err) {
                            // eslint-disable-next-line no-console
                            return console.error(err);
                        }
                    });
                });
            }
        }
    ];
}

function addComponent() {
    fs.readdirSync(path.resolve(__dirname, process.env.INPUT_DIR), { withFileTypes: true })
        .filter((dir) => dir.isDirectory())
        .forEach(({ name: folderName }) => {
            fs.readdirSync(path.resolve(__dirname, process.env.INPUT_DIR + folderName)).forEach((file) => {
                const name = file.split(/(.js)$/)[0].toLowerCase();

                if (name === folderName) {
                    const input = process.env.INPUT_DIR + folderName + '/' + file;
                    const output = process.env.OUTPUT_DIR + folderName + '/' + name;

                    addEntry('MantleUI.' + folderName, input, output, true);
                }
            });
        });
}

function addIcon() {
    const iconDir = path.resolve(__dirname, process.env.INPUT_DIR + 'icons');

    fs.readdirSync(path.resolve(__dirname, iconDir), { withFileTypes: true })
        .filter((dir) => dir.isDirectory())
        .forEach(({ name: folderName }) => {
            fs.readdirSync(path.resolve(__dirname, iconDir + '/' + folderName)).forEach((file) => {
                if (/\.js$/.test(file)) {
                    const name = file.split(/(.js)$/)[0].toLowerCase();
                    const input = process.env.INPUT_DIR + 'icons/' + folderName + '/' + file;
                    const output = process.env.OUTPUT_DIR + 'icons/' + folderName + '/' + name;

                    addEntry('MantleUI.icons.' + folderName, input, output, true);
                }
            });
        });
}

function addPassThrough() {
    const inputDir = process.env.INPUT_DIR + 'passthrough';
    const outputDir = process.env.OUTPUT_DIR + 'passthrough';

    addEntry('passthrough', `${inputDir}/index.js`, `${outputDir}/index`, false);
    addEntry('passthrough.tailwind', `${inputDir}/tailwind/index.js`, `${outputDir}/tailwind/index`, false);
}

function addMantleUI() {
    const input = process.env.INPUT_DIR + 'mantle-ui-react.all.js';
    const output = process.env.OUTPUT_DIR + 'mantle-ui-react.all';

    addEntry('MantleUI', input, output, false);
}

function addPackageJson() {
    const outputDir = path.resolve(__dirname, process.env.OUTPUT_DIR);
    const packageJson = `{
    "name": "@mantle-ui/react",
    "version": "${pkg.version}",
    "private": false,
    "author": "Mantle UI contributors",
    "description": "Mantle UI is an open source React component library.",
    "homepage": "https://github.com/Mantle-UI/mantle-ui",
    "repository": {
        "type": "git",
        "url": "https://github.com/Mantle-UI/mantle-ui.git"
    },
    "license": "MIT",
    "bugs": {
        "url": "https://github.com/Mantle-UI/mantle-ui/issues"
    },
    "keywords": [
        "mantle-ui",
        "react",
        "hooks",
        "next",
        "nextjs",
        "ui-kit",
        "ui library",
        "component library",
        "material",
        "material design",
        "bootstrap",
        "tailwind theme",
        "dark theme",
        "react components",
        "responsive components"
    ],
    "unpkg": "mantle-ui-react.all.min.js",
    "jsdelivr": "mantle-ui-react.all.min.js",
    "main": "mantle-ui-react.all.min.js",
    "module": "mantle-ui-react.all.esm.min.js",
    "web-types": "web-types.json",
    "peerDependencies": {
        "@types/react": "^17.0.0 || ^18.0.0 || ^19.0.0",
        "react": "^17.0.0 || ^18.0.0 || ^19.0.0",
        "react-dom": "^17.0.0 || ^18.0.0 || ^19.0.0"
    },
    "peerDependenciesMeta": {
        "@types/react": {
            "optional": true
        }
    },
    "dependencies": {
        "@types/react-transition-group": "^4.4.1",
        "react-transition-group": "^4.4.1"
    },
    "sideEffects": [
        "**/*.css"
    ],
    "engines": {
        "node": ">=14.0.0"
    }
}`;

    !fs.existsSync(outputDir) && fs.mkdirSync(outputDir);
    fs.writeFileSync(path.resolve(outputDir, 'package.json'), packageJson);
}

addIcon();
addComponent();
addMantleUI();
addPassThrough();
addCore();
addPackageJson();

export default entries;
