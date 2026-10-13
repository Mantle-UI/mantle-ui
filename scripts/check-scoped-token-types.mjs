import babel from '@babel/core';
import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

const repository = path.resolve(import.meta.dirname, '..');
const library = path.join(repository, 'components/lib');
const excluded = new Set(['StepperPanel']); // Definition-only helper: no styled root.

const containsStyleHook = (node) => {
    if (!node || typeof node !== 'object') {
        return false;
    }

    return (node.type === 'CallExpression' && node.callee?.name === 'useHandleStyle') || Object.values(node).some((value) => (Array.isArray(value) ? value.some(containsStyleHook) : containsStyleHook(value)));
};

const components = [];

for (const directory of fs.readdirSync(library, { withFileTypes: true })) {
    if (!directory.isDirectory()) {
        continue;
    }

    const folder = path.join(library, directory.name);
    const metadataPath = path.join(folder, 'package.json');

    if (!fs.existsSync(metadataPath)) {
        continue;
    }

    const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
    const declaration = fs.readdirSync(folder).find((file) => file.toLowerCase() === metadata.types?.replace(/^\.\//, '').toLowerCase());

    for (const file of fs.readdirSync(folder).filter((file) => file.endsWith('.js') && !file.endsWith('.spec.js'))) {
        const ast = babel.parseSync(fs.readFileSync(path.join(folder, file), 'utf8'), { babelrc: false, configFile: false, presets: ['@babel/preset-react'] });

        for (const statement of ast.program.body) {
            if (statement.type !== 'ExportNamedDeclaration' || statement.declaration?.type !== 'VariableDeclaration') {
                continue;
            }

            for (const variable of statement.declaration.declarations) {
                if (!excluded.has(variable.id.name) && containsStyleHook(variable.init)) {
                    if (!declaration) {
                        throw new Error(`Missing declaration for styled component ${variable.id.name}`);
                    }

                    const declarationPath = path.join(folder, declaration);
                    const declared = ts.createSourceFile(declarationPath, fs.readFileSync(declarationPath, 'utf8'), ts.ScriptTarget.Latest, true).statements.find((node) => ts.isClassDeclaration(node) && node.name?.text === variable.id.name);

                    components.push({ name: variable.id.name, declaration: declarationPath, folder: directory.name, generic: declared?.typeParameters?.length || 0 });
                }
            }
        }
    }
}

if (process.argv.includes('--fix')) {
    const byFile = new Map();

    components.forEach((component) => byFile.set(component.declaration, [...(byFile.get(component.declaration) || []), component]));

    for (const [file, items] of byFile) {
        let source = fs.readFileSync(file, 'utf8');
        const ast = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true);
        const edits = [];

        for (const { name } of items) {
            const declaration = ast.statements.find((node) => ts.isClassDeclaration(node) && node.name?.text === name);
            const argument = declaration?.heritageClauses?.[0]?.types[0]?.typeArguments?.[0];
            const propsName = argument && ts.isTypeReferenceNode(argument) ? argument.typeName.getText(ast) : `${name}Props`;
            const props = ast.statements.find((node) => (ts.isInterfaceDeclaration(node) || ts.isTypeAliasDeclaration(node)) && node.name.text === propsName);

            if (!props) {
                throw new Error(`Handle non-interface public props explicitly: ${name}/${propsName}`);
            }

            if (ts.isTypeAliasDeclaration(props)) {
                if (!props.type.getText(ast).includes('ComponentThemeProps')) {
                    edits.push({ start: props.type.pos, end: props.type.end, text: ` (${props.type.getText(ast)}) & ComponentThemeProps` });
                }

                continue;
            }

            const existing = props.members.find((member) => member.name?.getText(ast) === 'dt');

            if (existing) {
                edits.push({ start: existing.pos, end: existing.end, text: '' });
            }

            if (!props.heritageClauses?.some((clause) => clause.types.some((type) => type.expression.getText(ast) === 'ComponentThemeProps'))) {
                const clause = props.heritageClauses?.find((clause) => clause.token === ts.SyntaxKind.ExtendsKeyword);

                edits.push({ start: clause?.end ?? props.name.end, end: clause?.end ?? props.name.end, text: clause ? ', ComponentThemeProps' : ' extends ComponentThemeProps' });
            }
        }

        for (const edit of edits.sort((first, second) => second.start - first.start)) {
            source = source.slice(0, edit.start) + edit.text + source.slice(edit.end);
        }

        if (!source.includes("import { ComponentThemeProps } from '../themes/themes';")) {
            const lastImport = ast.statements.filter(ts.isImportDeclaration).at(-1);
            const position = lastImport?.end || 0;

            source = source.slice(0, position) + "\nimport { ComponentThemeProps } from '../themes/themes';\n" + source.slice(position);
        }

        fs.writeFileSync(file, source);
    }

    process.stdout.write(`Shared dt declarations applied to ${components.length} styled public components.\n`);
} else {
    const consumerPath = path.join(repository, 'scripts/scoped-token-consumer.tsx');
    const packageSpecifier = process.env.MANTLE_TYPE_PACKAGE || '../components/lib/mantle-ui-react.all';
    const source = [
        "import * as React from 'react';",
        `import * as Library from '${packageSpecifier}';`,
        ...components.flatMap(({ name, generic, folder, declaration }) => {
            const subpath = process.env.MANTLE_TYPE_PACKAGE ? `${packageSpecifier}/${folder}` : `../components/lib/${folder}/${path.basename(declaration, '.d.ts')}`;
            const typeArguments = generic ? `<${Array(generic).fill('any').join(', ')}>` : '';
            const tokens = "{ dt: { root: { background: '#112233' }, extend: { local: '2px' }, css: ({ dt }) => '.test { color: ' + dt('local') + '; }' } }";

            return [
                `import { ${name} as Subpath${name} } from '${subpath}';`,
                `const ${name}Tokens: Pick<React.ComponentProps<typeof Library.${name}${typeArguments}>, 'dt'> = ${tokens};`,
                `const Subpath${name}Tokens: Pick<React.ComponentProps<typeof Subpath${name}${typeArguments}>, 'dt'> = ${tokens};`
            ];
        })
    ].join('\n');
    const options = { strict: true, noEmit: true, skipLibCheck: false, target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.ESNext, moduleResolution: ts.ModuleResolutionKind.Bundler, jsx: ts.JsxEmit.ReactJSX };
    const host = ts.createCompilerHost(options);
    const readFile = host.readFile;
    const fileExists = host.fileExists;
    const getSourceFile = host.getSourceFile;

    host.readFile = (file) => (path.resolve(file) === consumerPath ? source : readFile(file));
    host.fileExists = (file) => path.resolve(file) === consumerPath || fileExists(file);
    host.getSourceFile = (file, languageVersion, ...rest) => (path.resolve(file) === consumerPath ? ts.createSourceFile(file, source, languageVersion, true) : getSourceFile(file, languageVersion, ...rest));
    const program = ts.createProgram([consumerPath], options, host);
    const diagnostics = ts.getPreEmitDiagnostics(program);

    if (diagnostics.length) {
        process.stderr.write(ts.formatDiagnosticsWithColorAndContext(diagnostics, { getCanonicalFileName: (file) => file, getCurrentDirectory: () => repository, getNewLine: () => '\n' }));
        process.exitCode = 1;
    } else {
        process.stdout.write(`Strict dt consumer passed for all ${components.length} styled public components at both root and subpath entrypoints.\n`);
    }

    if (process.env.MANTLE_TYPE_REPORT) {
        fs.writeFileSync(process.env.MANTLE_TYPE_REPORT, JSON.stringify({ passed: !diagnostics.length, count: components.length, entrypoints: components.length * 2, components: components.map(({ name }) => name), packageSpecifier }, null, 2));
    }
}
