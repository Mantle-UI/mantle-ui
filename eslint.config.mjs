import { includeIgnoreFile } from '@eslint/compat';
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import eslintConfigPrettier from 'eslint-config-prettier';
import jestDom from 'eslint-plugin-jest-dom';
import { fileURLToPath } from 'node:url';
import tseslint from 'typescript-eslint';

const gitignorePath = fileURLToPath(new URL('.gitignore', import.meta.url));

export default [
    includeIgnoreFile(gitignorePath),
    ...nextCoreWebVitals,
    ...tseslint.configs.recommended,
    jestDom.configs['flat/recommended'],
    eslintConfigPrettier,
    {
        files: ['api-scripts/**/*.js'],
        rules: {
            '@typescript-eslint/no-var-requires': 'off',
            '@typescript-eslint/no-require-imports': 'off',
            '@typescript-eslint/no-unused-expressions': 'off'
        }
    },
    {
        rules: {
            '@next/next/no-img-element': 'off',
            'react/display-name': 'off',
            'react/no-unescaped-entities': 'off',
            '@typescript-eslint/no-empty-function': 'off',
            '@typescript-eslint/no-empty-interface': 'off',
            '@typescript-eslint/no-empty-object-type': 'off',
            '@typescript-eslint/no-unused-vars': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-unused-expressions': 'off',
            // eslint-config-next 16 pulls in eslint-plugin-react-hooks 7's React Compiler rule set;
            // keep only the long-standing hook rules and defer the new compiler-oriented ones for a follow-up pass.
            'react-hooks/static-components': 'off',
            'react-hooks/use-memo': 'off',
            'react-hooks/preserve-manual-memoization': 'off',
            'react-hooks/incompatible-library': 'off',
            'react-hooks/immutability': 'off',
            'react-hooks/globals': 'off',
            'react-hooks/refs': 'off',
            'react-hooks/set-state-in-effect': 'off',
            'react-hooks/error-boundaries': 'off',
            'react-hooks/purity': 'off',
            'react-hooks/set-state-in-render': 'off',
            'react-hooks/unsupported-syntax': 'off',
            'react-hooks/config': 'off',
            'react-hooks/gating': 'off',
            'no-console': 2,
            'padding-line-between-statements': [
                'error',
                { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
                { blankLine: 'any', prev: ['const', 'let', 'var'], next: ['const', 'let', 'var'] },
                { blankLine: 'any', prev: ['case', 'default'], next: 'break' },
                { blankLine: 'any', prev: 'case', next: 'case' },
                { blankLine: 'always', prev: '*', next: 'return' },
                { blankLine: 'always', prev: 'block', next: '*' },
                { blankLine: 'always', prev: '*', next: 'block' },
                { blankLine: 'always', prev: 'block-like', next: '*' },
                { blankLine: 'always', prev: '*', next: 'block-like' }
            ]
        }
    }
];
