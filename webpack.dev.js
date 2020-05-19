const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common');

module.exports = merge.smart(common, {
  // Source map will be generated for debugging on browsers
  mode: 'development',

  devtool: 'inline-source-map',

  module: {
    rules: [{
      // Files has `ts` suffix
      test: /\.ts$/,
      // will be compiled as TypeScript code
      use: [{
        loader: 'ts-loader',
        options: {
          configFile: 'tsconfig.dev.json'
        }
      }]
    }]
  },

  devServer: {
    // Set directory for source code
    contentBase: path.join(__dirname, 'src'),
    port: 8080,

    host: '0.0.0.0',
    hot: true
  }
})