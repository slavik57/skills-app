"use strict";
var webpack = require('webpack');
var pathHelper_1 = require('../../common/pathHelper');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var config = {
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
        path: pathHelper_1.PathHelper.getPathFromRoot('dist'),
        publicPath: '/dist/',
        filename: '[name].js',
        chunkFilename: '[id].chunk.js'
    },
    plugins: [
        new ExtractTextPlugin('[name].css'),
        new webpack.optimize.CommonsChunkPlugin({
            name: ['app', 'vendor', 'signin', 'polyfills']
        }),
        new webpack.DefinePlugin({
            'process.env': {
                'ENV': JSON.stringify(process.env.NODE_ENV)
            }
        }),
        new HtmlWebpackPlugin({
            template: pathHelper_1.PathHelper.getPathFromRoot('src', 'app', 'views', 'signin.html'),
            filename: 'signin.html',
            chunks: ['polyfills', 'vendor', 'signin']
        }),
        new HtmlWebpackPlugin({
            template: pathHelper_1.PathHelper.getPathFromRoot('src', 'app', 'views', 'home.html'),
            filename: 'home.html',
            chunks: ['polyfills', 'vendor', 'app']
        })
    ]
};
exports.webpackTestConfig = config;
//# sourceMappingURL=webpack.test.config.js.map