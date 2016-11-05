var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  target: 'node',
  entry: {
    server: './src/server/server.js',
    client: './src/client/client.js'
  },
  output: {
    path: './dist',
    filename: '[name].js',
    // libraryTarget: 'commonjs'
  },
  resolve: {
    extensions: ['', '.ts', '.js']
  },
  module: {
    loaders: [
      { test: /\.ts$/, loader: 'babel-loader?presets[]=es2015!ts-loader' },
      // { test: /\.js$/, loader: 'babel-loader?presets[]=es2015!' },
      { test: /\.md$/, loader: 'ignore-loader' },
      { test: /LICENSE$/, loader: 'ignore-loader' },
      { test: /\.json$/, loader: 'json-loader' },
      { test: /\.(jpg|png|ico)$/, loader: 'file?name=[path][name].[hash].[ext]' }
    ]
  },
  externals: [
    /^(?!\.|\/).+/i,
  ],
  plugins: [    
    new HtmlWebpackPlugin ({
      inject: true,
      chunks: ['client'],
      template: './src/client/main.html',
      filename: 'index.html'
    }),
    new CopyWebpackPlugin([
        { from: './src/client/static' }
    ])
  ],
  // target: "node-webkit"
}