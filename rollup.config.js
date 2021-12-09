export default {
  input: 'src/index.js',
  output: {
    file: 'cool-parser.js',
    format: 'umd',
    name: 'CollParser'
  },
  watch: {
    buildDelay: 500
  }
}
