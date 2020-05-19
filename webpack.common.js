const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;

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
    }),

    // Copy all files under `src/assets` into `dist/assets` directory

    // Optimize all images in project directory on build
    new ImageminPlugin({
      test: /\.(jpe?g|png|gif|svg)$/i,
      pngquant: {
        verbose: true,
        quality: '80-90',
      }
    }),
  ],

  module: {
    rules: [
      {
        // Files has `ts` suffix
        test: /\.ts$/,
        // will be compiled as TypeScript code
        use: 'ts-loader'
      },
      {
        // Copy asset files into dist directory
        test: /\.(gif|png|jpg|eot|wof|woff|ttf|svg)$/,
        loader: 'file-loader',
        options: {
          context: 'src/assets',

          // Filename will not be changed unless the content of the asset is changed
          name: '[name]-[contenthash].[ext]',

          // Keep the original directory structure under the output path
          outputPath: (name, resourcePath, context) => {
            const relativePath = path.relative(context, resourcePath);
            const dir = path.dirname(relativePath);
            return `assets/${dir}/${name}`;
          },
        }
      },
    ]
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
