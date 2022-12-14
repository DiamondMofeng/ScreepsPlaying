const commonjs = require('@rollup/plugin-commonjs');

module.exports = {
  input: 'src/main.js',
  output: {
    file: 'dist/main.js',
    format: 'cjs',
    sourcemap: true
  },
  plugins: [commonjs()]
};