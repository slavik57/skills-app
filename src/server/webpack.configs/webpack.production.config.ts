var webpackMerge = require('webpack-merge');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
import * as webpack from 'webpack';
import {Configuration} from 'webpack';
import {webpackCommonConfiguration} from './webpack.common.config'
import {PathHelper} from '../../common/pathHelper';

interface IProductionConfiguration extends Configuration {
  htmlLoader: any;
}

var config: IProductionConfiguration = {

  devtool: 'source-map',

  output: {
    path: PathHelper.getPathFromRoot('dist'),
    publicPath: '/dist/',
    filename: '[name].[hash].js',
    chunkFilename: '[id].[hash].chunk.js'
  },

  htmlLoader: {
    minimize: false // workaround for ng2
  },

  plugins: [
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin(),
    new ExtractTextPlugin('[name].[hash].css')
  ]
}

export var webpackProductionConfig: Configuration =
  webpackMerge(webpackCommonConfiguration, config);
