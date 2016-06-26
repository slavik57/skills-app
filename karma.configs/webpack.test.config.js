"use strict";
var config = {
    devtool: '#inline-source-map',
    entry: {
        test: ['sinon/pkg/sinon.js']
    },
    resolve: {
        extensions: ['', '.ts', '.js'],
        alias: {
            sinon: 'sinon/pkg/sinon.js',
        }
    },
    module: {
        noParse: [/sinon\.js/],
        loaders: [
            {
                test: /sinon\/pkg\/sinon\.js/,
                loader: 'imports?define=>false,require=>false',
            },
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
    }
};
exports.webpackTestConfig = config;
//# sourceMappingURL=webpack.test.config.js.map