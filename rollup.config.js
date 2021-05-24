// @ts-check
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import {
    default as tsWessberg
} from '@wessberg/rollup-plugin-ts';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import sourcemaps from 'rollup-plugin-sourcemaps';
import * as path from 'path';

// base dir is the directory where rollup.config.js resides.
// If we move rollup.config.js then we must adjust paths that use baseDir
const baseDir = path.resolve(__dirname, '.');
const srcDir = path.resolve(baseDir, '.');
const distDir = path.resolve(baseDir, 'dist');

function typescriptPlugin(options) {
    return tsWessberg(options);
}

export default {
    input: path.resolve(srcDir, 'app.ts'),
    output: [{
        dir: distDir,
        format: 'es',
        sourcemap: true,
    }],
    plugins: [
        resolve(),
        commonjs(),
        typescriptPlugin({
            tsconfig: path.resolve(srcDir, 'tsconfig.json'),
            cwd: srcDir
        }),
        sourcemaps()
    ]
};