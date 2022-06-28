import babel from '@rollup/plugin-babel'
import { terser } from 'rollup-plugin-terser'
import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import typescript from '@rollup/plugin-typescript'
import alias from '@rollup/plugin-alias'

const path = require('path')
const resolveDir = dir => path.resolve(__dirname, dir)
const env = process.env.NODE_ENV
const config = {
  input: 'src/main.ts',
  output: {
    format: 'umd',
    file: 'dist/index.js',
    name: 'Yeux',
    sourcemap: env !== 'production'
  },
  plugins: [
    typescript(),
    resolve(),
    babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**'
    }),
    livereload(),
    serve({
      open: true,
      port: 8000,
      openPage: '/playground/index.html',
      contentBase: ''
    }),
    replace({
      preventAssignment: false,
      'process.env.NODE_ENV': JSON.stringify(env)
    }),
    commonjs(),
    alias({
      entries: [{ find: '@', replacement: resolveDir('src') }]
    })
  ]
}
if (env === 'production') {
  config.plugins.push(terser())
}
export default config
