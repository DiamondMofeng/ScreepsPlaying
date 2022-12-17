const commonjs = require('@rollup/plugin-commonjs');
const { default: typescriptPaths } = require('rollup-plugin-typescript-paths');
const typescript = require('rollup-plugin-typescript2');


module.exports = {
  input: 'src/main.ts',
  output: {
    // file: `../screeps_gohorse_dev___21025\\default\\main.js`,
    file: `dist/main.js`,
    format: 'cjs',
    sourcemap: true
  },
  plugins: [
    commonjs(),
    typescriptPaths({ preserveExtensions: true }),
    typescript({ tsconfig: './tsconfig.json' }),
  ]
};