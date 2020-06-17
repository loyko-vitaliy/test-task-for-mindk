const autoprefixer = require('autoprefixer')
const mqpacker = require('css-mqpacker')
const sortCSSmq = require('sort-css-media-queries')

const plugins = [mqpacker({ sort: sortCSSmq.desktopFirst })]

module.exports = ({ options }) => {
  const mode = options.mode

  if (mode === 'production') {
    plugins.push(autoprefixer())
  }

  return { plugins }
}