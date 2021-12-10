export default {
  input: 'src/index.js',
  output: {
    file: 'cool-parser.js',
    format: 'umd',
    name: 'CoolParser'
  },
  watch: {
    buildDelay: 500
  }
}
