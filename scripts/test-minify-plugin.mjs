import assert from 'node:assert/strict';
import vm from 'node:vm';
import { createMinifyPlugin } from './minify-plugin.mjs';

const options = { maxWorkers: 1, compress: { keep_infinity: true, pure_getters: true, reduce_funcs: false } };
const expected = structuredClone(options);
const plugin = createMinifyPlugin(options, 'win32');

await plugin.renderChunk('exports.value = 42;', {}, { format: 'cjs' });
await plugin.renderChunk('export const value = 42;', {}, { format: 'es' });
const { code, map } = await plugin.renderChunk('var MantleUI = (function () { return { value: 42 }; })();', {}, { format: 'iife', sourcemap: true });
const context = vm.createContext({});

vm.runInContext(code, context);
assert.equal(context.MantleUI.value, 42, 'IIFE globals survive preceding CJS/ESM minification');
assert.equal(map.version, 3, 'Rollup receives a usable source map');
assert.deepEqual(options, expected, 'Minification does not mutate options shared by outputs');
const next = createMinifyPlugin(options, 'win32');
const output = await next.renderChunk('var OtherGlobal = 7;', {}, { format: 'iife' });

vm.runInContext(output.code, context);
assert.equal(context.OtherGlobal, 7, 'Separate entries keep their global bindings');
process.stdout.write('Windows minification: 4 assertions passed\n');
