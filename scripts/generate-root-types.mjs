import fs from 'node:fs';
import path from 'node:path';
import { format, resolveConfig } from 'prettier';
import ts from 'typescript';

const library = path.resolve(import.meta.dirname, '..', 'components', 'lib');
const runtime = fs.readFileSync(path.join(library, 'mantle-ui-react.all.js'), 'utf8');
const references = new Map();

for (const [, reference] of runtime.matchAll(/from '(\.\/[^']+)'/g)) {
    const folder = reference.split('/')[1];

    if (folder === 'icons') {
        references.set(reference, reference);

        continue;
    }

    const metadata = JSON.parse(fs.readFileSync(path.join(library, folder, 'package.json'), 'utf8'));
    const declared = metadata.types?.replace(/^\.\//, '');
    const actual = fs.readdirSync(path.join(library, folder)).find((file) => file.toLowerCase() === declared?.toLowerCase());
    const types = actual?.replace(/\.d\.ts$/, '');

    if (!types || !fs.existsSync(path.join(library, folder, `${types}.d.ts`))) {
        throw new Error(`Missing declaration entry for ${reference}`);
    }

    references.set(reference, `./${folder}/${types}`);
}

const declarationPath = (reference) => path.join(library, reference.startsWith('./icons/') ? `${reference}/index.d.ts` : `${reference}.d.ts`);
const program = ts.createProgram([...new Set(references.values())].map(declarationPath), { module: ts.ModuleKind.ESNext, moduleResolution: ts.ModuleResolutionKind.Bundler });
const checker = program.getTypeChecker();
const exported = new Set();
const declarations = runtime
    .replace(/export \* from '(\.\/[^']+)';/g, (_, reference) => {
        const target = references.get(reference);
        const source = program.getSourceFile(declarationPath(target));
        const values = [];
        const types = [];

        if (!source) {
            throw new Error(`Missing declaration source for ${reference}`);
        }

        checker.getExportsOfModule(checker.getSymbolAtLocation(source)).forEach((symbol) => {
            if (symbol.name === 'default' || exported.has(symbol.name)) {
                return;
            }

            exported.add(symbol.name);
            const resolved = symbol.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(symbol) : symbol;

            (resolved.flags & ts.SymbolFlags.Value ? values : types).push(symbol.name);
        });

        return [values.length ? `export { ${values.join(', ')} } from '${target}';` : '', types.length ? `export type { ${types.join(', ')} } from '${target}';` : ''].filter(Boolean).join('\n');
    })
    .replace(/export \{ default \} from '(\.\/[^']+)';/, (_, reference) => `export { default } from '${references.get(reference)}';`);
const output = path.join(library, 'mantle-ui-react.all.d.ts');
const options = await resolveConfig(output);

fs.writeFileSync(output, await format(`// Generated from mantle-ui-react.all.js by scripts/generate-root-types.mjs.\n${declarations}`, { ...options, parser: 'typescript' }));
