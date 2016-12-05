var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  target: 'node',
  entry: {
    server: './src/server/server.js',
    client: './src/client/init.js'
  },
  output: {
    path: './dist',
    filename: '[name].js',
    libraryTarget: 'umd'
  },
  resolve: {
    extensions: ['', '.ts', '.js']
  },
  module: {
    loaders: [
      { test: /\.js$/, exclude: './node_modules', loader: 'babel-loader?presets[]=es2015' },
      { test: /\.md$/, loader: 'ignore-loader' },
      { test: /LICENSE$/, loader: 'ignore-loader' },
      { test: /\.json$/, loader: 'json-loader' },
      { test: /\.(jpg|png|ico)$/, loader: 'file?name=[path][name].[hash].[ext]' },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract(
          'style', // backup loader when not building .css file
          'css!sass' // loaders to preprocess CSS
        )
      }
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
    ]),
    new ExtractTextPlugin('[name].css'),
  ],
  // target: "node-webkit"
}
