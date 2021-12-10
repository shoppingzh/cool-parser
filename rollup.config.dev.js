
export default {
  input: [
    'src/index.js',
    'src/parse.js',
    'src/validator.js'
  ],
  output: {
    dir: 'dist',
    format: 'cjs'
  },
  watch: {
    buildDelay: 500
  },
  plugins: [
  ]
}
