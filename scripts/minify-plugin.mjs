import terser from '@rollup/plugin-terser';
import { minify } from 'terser';

export const createMinifyPlugin = (options, platform = process.platform) => {
    if (platform !== 'win32') {
        return terser(options);
    }

    // Repeated worker creation/termination can crash Node natively on Windows.
    // Use the same Terser engine and compression options in the build process.
    return {
        name: 'terser-single-process',
        async renderChunk(code, chunk, outputOptions) {
            const result = await minify(code, {
                // Terser adds module/toplevel shorthand settings to this object.
                // Each output must receive its own copy to preserve IIFE globals.
                compress: { ...options.compress },
                module: outputOptions.format === 'es',
                toplevel: outputOptions.format === 'cjs',
                sourceMap: !!outputOptions.sourcemap
            });

            return { code: result.code, map: typeof result.map === 'string' ? JSON.parse(result.map) : result.map || null };
        }
    };
};
