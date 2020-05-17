const path = require('path');

module.exports = {
  // The main js file. The whole script will be executed from this file
  entry: './src/ts/index.ts',

  output: {
    path: path.join(__dirname, "dist"),
    filename: "index.js"
  },

  module: {
    rules: [{
      // Files has `ts` suffix
      test: /\.ts$/,
      // will be compiled as TypeScript code
      use: 'ts-loader'
    }]
  },
  // To resolve `.ts` files on import statement
  resolve: {
    modules: [
      "node_modules", // Search directories under `node_modules`
    ],
    extensions: [
      '.ts',
      '.js' // Load pure-js library under `node_modules`
    ]
  }
};
