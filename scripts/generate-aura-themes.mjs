import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const babel = require('@babel/core');
const projectRoot = path.resolve(import.meta.dirname, '..');

const loadModule = (filePath) => {
    const { code } = babel.transformFileSync(filePath, {
        babelrc: false,
        presets: [['@babel/preset-env', { targets: { node: 'current' } }]]
    });
    const module = { exports: {} };
    const localRequire = (request) => {
        if (!request.startsWith('.')) {
            return require(request);
        }

        const resolvedPath = path.resolve(path.dirname(filePath), request.endsWith('.js') ? request : `${request}.js`);

        return loadModule(resolvedPath);
    };

    new Function('exports', 'module', 'require', code)(module.exports, module, localRequire);

    return module.exports;
};

const { Aura } = loadModule(path.join(projectRoot, 'components/lib/themes/Aura.js'));
const { createThemeCss } = loadModule(path.join(projectRoot, 'components/lib/themes/Theme.js'));
const header = '/* Generated Mantle Aura compatibility theme. Do not edit directly. */\n';

const compatibilityThemes = {
    light: {
        source: 'lara-light-blue',
        colors: {
            '#eff6ff': '#ecfdf5',
            '#dbeafe': '#d1fae5',
            '#bfdbfe': '#a7f3d0',
            '#93c5fd': '#6ee7b7',
            '#60a5fa': '#34d399',
            '#3b82f6': '#10b981',
            '#2563eb': '#059669',
            '#1d4ed8': '#047857',
            '#1e40af': '#065f46'
        }
    },
    dark: {
        source: 'lara-dark-cyan',
        colors: {
            '#a5f3fc': '#a7f3d0',
            '#67e8f9': '#6ee7b7',
            '#22d3ee': '#34d399',
            '#06b6d4': '#10b981',
            '#0891b2': '#059669',
            '#0e7490': '#047857'
        }
    }
};

const createCompatibilityCss = (colorScheme) => {
    const { source, colors } = compatibilityThemes[colorScheme];
    const sourcePath = path.join(projectRoot, `public/themes/${source}/theme.css`);
    let css = fs.readFileSync(sourcePath, 'utf8').replace(/@font-face\s*{[^}]*}\s*/g, '');

    Object.entries(colors).forEach(([from, to]) => {
        css = css.replaceAll(from, to);
    });

    return css;
};

const writeTheme = (colorScheme) => {
    const filePath = path.join(projectRoot, `public/themes/aura-${colorScheme}-emerald/theme.css`);
    const componentCss = Aura.css({ prefix: 'mantle', colorScheme });
    const css = `${header}/* Legacy Mantle compatibility bridge; Aura tokens and component bridges follow. */\n${createCompatibilityCss(colorScheme)}\n\n${createThemeCss(Aura, { colorScheme })}\n\n${componentCss}`;

    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, css);
};

writeTheme('light');
writeTheme('dark');
