const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;

module.exports = {
  // The main js file. The whole script will be executed from this file
  entry: './src/ts/index.tsx',

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
        // Files has suffix of `ts` or `tsx`
        test: /\.tsx?$/,
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

      // Use Sass
      {
        test: /\.scss/,
        use: [
          // Generate tag `link` and embed into `head` element
          'style-loader',

          // Resolve `@import` or `url()` in the CSS files
          {
            loader: 'css-loader',
            options: {
              // Bundle content of `url()` method
              url: true,

              // Use source map
              sourceMap: true,

              // 0 => no loaders (default);
              // 1 => postcss-loader;
              // 2 => postcss-loader, sass-loader
              importLoaders: 2
            },
          },

          // Compile Sass
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            }
          }
        ],
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
      '.tsx',  // React.js files
      '.js' // Load pure-js library under `node_modules`
    ]
  }
};
