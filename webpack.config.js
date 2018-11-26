const path = require('path')

module.exports = {
  entry: './js/gif.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  watch: true
}
