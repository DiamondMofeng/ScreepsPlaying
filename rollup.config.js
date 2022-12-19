const resolve = require('@rollup/plugin-node-resolve')
const commonjs = require('@rollup/plugin-commonjs');
const { default: typescriptPaths } = require('rollup-plugin-typescript-paths');
const typescript = require('rollup-plugin-typescript2');
const copy = require('rollup-plugin-copy');

const copyTarget = process.env.COPY_TARGET

const runCopy = () => {
  return copy({
    targets: [
      {
        src: 'dist/main.js',
        dest: copyTarget
      },
      {
        src: 'dist/main.js.map',
        dest: copyTarget,
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