import babel from '@rollup/plugin-babel'
import banner from 'rollup-plugin-banner'
import { uglify } from 'rollup-plugin-uglify'

const bannerStr = `
cool-parser
A question parser
by xpzheng
`

export default {
  input: 'src/index.js',
  output: {
    file: 'cool-parser.js',
    format: 'umd',
    name: 'CoolParser'
  },
  watch: {
    buildDelay: 500
  },
  plugins: [
    babel({
      babelHelpers: 'bundled',
      presets: ['@babel/preset-env']
    }),
    banner(bannerStr),
    uglify({
      sourcemap: false
    })
  ]
}
