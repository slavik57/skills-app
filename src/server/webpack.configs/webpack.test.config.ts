import * as webpack from 'webpack';
import {Configuration} from 'webpack';
import {PathHelper} from '../../common/pathHelper';
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var config: Configuration = {

  devtool: '#inline-source-map',

  entry: {
    'polyfills': './src/app/polyfills.ts',
    'app': './src/app/app.ts',
    'signin': './src/app/signinApp.ts',
    'vendor': './src/app/vendor.ts'
  },

  resolve: {
    extensions: ['', '.ts', '.js']
  },

  module: {
    loaders: [
      {
        test: /\.ts$/,
        loader: 'ts'
      },
      {
        test: /\.html$/,
        loader: 'html'

      },
      {
        test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
        loader: 'null'
      },
      {
        test: /\.css$/,
        loader: 'null'
      },
      {
        test: /\.scss$/,
        loader: 'null'
      }
    ]
  },
  output: {
    path: PathHelper.getPathFromRoot('dist'),
    publicPath: '/dist/',
    filename: '[name].js',
    chunkFilename: '[id].chunk.js'
  },
  plugins: [
    new ExtractTextPlugin('[name].css'),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'signinCommon',
      chunks: ['signin', 'vendor']
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'homeCommon',
      chunks: ['app', 'vendor']
    }),
    new webpack.DefinePlugin({
      'process.env': {
        'ENV': JSON.stringify(process.env.NODE_ENV)
      }
    }),
    new HtmlWebpackPlugin({
      template: PathHelper.getPathFromRoot('src', 'app', 'views', 'signin.html'),
      filename: 'signin.html',
      chunks: ['polyfills', 'signinCommon', 'vendor', 'signin']
    }),
    new HtmlWebpackPlugin({
      template: PathHelper.getPathFromRoot('src', 'app', 'views', 'home.html'),
      filename: 'home.html',
      chunks: ['polyfills', 'homeCommon', 'vendor', 'app']
    })
  ]
}

export var webpackTestConfig: Configuration = config;
