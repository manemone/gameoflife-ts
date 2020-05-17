const merge = require('webpack-merge');
const common = require('./webpack.common');

module.exports = merge(common, {
  // Source map will be generated for debugging on browsers
    mode: 'development',
})
