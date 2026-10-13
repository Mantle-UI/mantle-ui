/** @jest-environment node */
import { parseSync } from '@babel/core';
import fs from 'fs';
import path from 'path';

const library = path.resolve(__dirname, '..');
const files = fs
    .readdirSync(library, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .flatMap((entry) =>
        fs
            .readdirSync(path.join(library, entry.name))
            .filter((file) => file.endsWith('.js') && !file.endsWith('.spec.js'))
            .map((file) => path.join(library, entry.name, file))
    );

const walk = (node, visit) => {
    if (!node || typeof node !== 'object') {
        return;
    }

    visit(node);
    Object.values(node).forEach((value) => (Array.isArray(value) ? value.forEach((child) => walk(child, visit)) : walk(value, visit)));
};

describe('portal integration ownership audit', () => {
    it('supplies the actual roots and explicit owning instance at every built-in Portal call site, including multiline JSX', () => {
        const portals = [];

        files.forEach((file) => {
            const ast = parseSync(fs.readFileSync(file, 'utf8'), { babelrc: false, configFile: false, presets: ['@babel/preset-react'] });

            walk(ast, (node) => {
                if (node.type === 'JSXOpeningElement' && node.name.name === 'Portal') {
                    const names = node.attributes.map((attribute) => attribute.name?.name);

                    portals.push(path.relative(library, file));
                    expect({ file: path.relative(library, file), roots: names.includes('themeRootRef'), instance: names.includes('themeInstance') }).toEqual({ file: path.relative(library, file), roots: true, instance: true });
                }
            });
        });
        expect(portals).toHaveLength(24);
    });

    it('supplies ownership and roots to direct drag-selection portal bridges', () => {
        const ast = parseSync(fs.readFileSync(path.join(library, 'datatable/TableBody.js'), 'utf8'), { babelrc: false, configFile: false, presets: ['@babel/preset-react'] });
        const bridges = [];

        walk(ast, (node) => {
            if (node.type === 'CallExpression' && node.callee.name === 'usePortalTheme') {
                bridges.push(node.arguments[0].properties.map((property) => property.key.name));
            }
        });
        expect(bridges).toHaveLength(1);
        expect(bridges[0]).toEqual(expect.arrayContaining(['themeRootRef', 'themeOrigin', 'themeInstance', 'themeEnabled']));
    });
});
