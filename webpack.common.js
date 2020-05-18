const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  // The main js file. The whole script will be executed from this file
  entry: './src/ts/index.ts',

  output: {
    path: path.join(__dirname, "dist"),
    filename: "index.[hash:8].js"
  },

  plugins: [
    // Copy the entry html file to `dist` and insert a reference line to the compiled js file
    new HtmlWebpackPlugin({
      file: path.join(__dirname, 'dist', 'index.html'),
      template: 'src/index.html'
    })
  ],

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
