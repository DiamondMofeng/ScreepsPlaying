const commonjs = require('@rollup/plugin-commonjs');
// const typescript = require('rollup-plugin-typescript2');


module.exports = {
  input: 'src/main.js',
  output: {
    file: 'dist/main.js',
    format: 'cjs',
    sourcemap: true
  },
  plugins: [
    commonjs(),
    // typescript({ tsconfig: './tsconfig.json' })
  ]
};