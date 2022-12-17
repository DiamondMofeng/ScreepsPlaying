const resolve = require('@rollup/plugin-node-resolve')
const commonjs = require('@rollup/plugin-commonjs');
const { default: typescriptPaths } = require('rollup-plugin-typescript-paths');
const typescript = require('rollup-plugin-typescript2');
const copy = require('rollup-plugin-copy');

const runCopy = () => {
  return copy({
    targets: [
      // {
      //   src: 'dist/main.js',
      //   dest: 'dist/'
      // },
      {
        src: 'dist/main.js.map',
        dest: 'dist/',
        rename: name => name + '.map.js',
        transform: contents => `module.exports = ${contents.toString()};`
      }
    ],
    hook: 'writeBundle',
    verbose: true
  })
}

module.exports = {
  input: 'src/main.ts',
  output: {
    // file: `../screeps_gohorse_dev___21025\\default\\main.js`,
    file: `dist/main.js`,
    format: 'cjs',
    sourcemap: true
  },
  plugins: [
    resolve(),
    commonjs(),
    typescriptPaths({ preserveExtensions: true }),
    typescript({ tsconfig: './tsconfig.json' }),
    runCopy(),
  ]
};