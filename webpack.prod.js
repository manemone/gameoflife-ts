const merge = require('webpack-merge');
const common = require('./webpack.common');

module.exports = merge.smart(common, {
  mode: 'production',

  module: {
    rules: [{
      // Files has `ts` suffix
      test: /\.ts$/,
      // will be compiled as TypeScript code
      use: [{
        loader: 'ts-loader',
        options: {
          configFile: 'tsconfig.prod.json'
        }
      }]
    }]
  },
})