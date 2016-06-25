"use strict";
var config = {
    devtool: '#inline-source-map',
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
    }
};
exports.webpackTestConfig = config;
//# sourceMappingURL=webpack.test.config.js.map