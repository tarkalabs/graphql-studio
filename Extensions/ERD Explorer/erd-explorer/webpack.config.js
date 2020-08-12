const path = require("path");

module.exports = {
  entry: {
    erdViewer: "./src/view/app/index.tsx"
  },
  output: {
    path: path.resolve(__dirname, "erdViewer"),
    filename: "[name].js"
  },
  devtool: "eval-source-map",
  resolve: {
    extensions: [".js", ".ts", ".tsx", ".json", ".scss"],
    /*alias: {
      'pg-native': path.join(__dirname, 'aliases/pg-native.js'),
      'tls': path.join(__dirname, 'aliases/pg-native.js'),
      'fs': path.join(__dirname, 'aliases/pg-native.js'),
      'dns': path.join(__dirname, 'aliases/pg-native.js'),
      'net': path.join(__dirname, 'aliases/pg-native.js'),
    },*/
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        loader: "ts-loader",
        options: {}
      },{
        test: /\.(scss)$/,
        use: [
          {
            // Adds CSS to the DOM by injecting a `<style>` tag
            loader: 'style-loader'
          },
          {
            // Interprets `@import` and `url()` like `import/require()` and will resolve them
            loader: 'css-loader'
          },
          {
            // Loader for webpack to process CSS with PostCSS
            loader: 'postcss-loader',
            options: {
              plugins: function () {
                return [
                  require('autoprefixer')
                ];
              }
            }
          },
          {
            // Loads a SASS/SCSS file and compiles it to CSS
            loader: 'sass-loader'
          }
        ]
      },{
        test: /\.(css)$/,
        use: [
          {
            // Adds CSS to the DOM by injecting a `<style>` tag
            loader: 'style-loader'
          },
          {
            // Interprets `@import` and `url()` like `import/require()` and will resolve them
            loader: 'css-loader'
          },
          {
            // Loader for webpack to process CSS with PostCSS
            loader: 'postcss-loader',
            options: {
              plugins: function () {
                return [
                  require('autoprefixer')
                ];
              }
            }
          }
        ]
      }
      ]
  },
  performance: {
    hints: false
  }
};