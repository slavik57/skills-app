"use strict";
var webpack = require('webpack');
var pathHelper_1 = require('../../common/pathHelper');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
process.env.ENV = process.env.NODE_ENV;
exports.webpackCommonConfiguration = {
    entry: {
        'polyfills': './src/app/polyfills.ts',
        'app': './src/app/app.ts',
        'signin': './src/app/signinApp.ts',
        'vendor': './src/app/vendor.ts',
        'design': './src/app/design.scss'
    },
    resolve: {
        extensions: ['', '.ts', '.js', 'scss']
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
                loader: 'file?name=assets/[name].[hash].[ext]'
            },
            {
                test: /\.scss$/,
                exclude: pathHelper_1.PathHelper.getPathFromRoot('src', 'app', 'modules'),
                loader: ExtractTextPlugin.extract('style', 'css!resolve-url!sass?sourceMap')
            },
            {
                test: /\.scss$/,
                include: pathHelper_1.PathHelper.getPathFromRoot('src', 'app', 'modules'),
                loader: 'raw!sass'
            },
            {
                test: /\.css$/,
                exclude: pathHelper_1.PathHelper.getPathFromRoot('src', 'app', 'modules'),
                loader: ExtractTextPlugin.extract('style', 'css!resolve-url!css?sourceMap')
            },
            {
                test: /\.css$/,
                include: pathHelper_1.PathHelper.getPathFromRoot('src', 'app', 'modules'),
                loader: 'raw!resolve-url'
            }
        ]
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: 'signinCommon',
            chunks: ['signin', 'vendor', 'design'],
            minChunks: Infinity
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'homeCommon',
            chunks: ['app', 'vendor', 'design'],
            minChunks: Infinity
        }),
        new webpack.DefinePlugin({
            'process.env': {
                'ENV': JSON.stringify(process.env.NODE_ENV)
            }
        }),
        new webpack.ProvidePlugin({
            "window.$": "jquery",
            "window.jQuery": "jquery",
            "root.jQuery": "jquery"
        }),
        new HtmlWebpackPlugin({
            template: pathHelper_1.PathHelper.getPathFromRoot('src', 'app', 'views', 'signin.html'),
            filename: 'signin.html',
            chunks: ['polyfills', 'signinCommon', 'design', 'vendor', 'signin']
        }),
        new HtmlWebpackPlugin({
            template: pathHelper_1.PathHelper.getPathFromRoot('src', 'app', 'views', 'home.html'),
            filename: 'home.html',
            chunks: ['polyfills', 'homeCommon', 'design', 'vendor', 'app']
        })
    ]
};
//# sourceMappingURL=webpack.common.config.js.map