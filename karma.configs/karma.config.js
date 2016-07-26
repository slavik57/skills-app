"use strict";
var webpack_test_config_1 = require('./webpack.test.config');
exports.karmaConfig = function (config) {
    var _config = {
        basePath: '',
        frameworks: ['mocha', 'jasmine', 'sinon'],
        files: [
            { pattern: './karma.configs/karma-test-shim.js', watched: false }
        ],
        preprocessors: {
            './karma.configs/karma-test-shim.js': ['webpack', 'sourcemap']
        },
        webpack: webpack_test_config_1.webpackTestConfig,
        webpackMiddleware: {
            stats: 'errors-only'
        },
        mochaReporter: {
            output: 'autowatch',
            showDiff: true
        },
        webpackServer: {
            noInfo: true
        },
        plugins: [
            'karma-chai',
            'karma-mocha',
            'karma-mocha-reporter',
            'karma-webpack',
            'karma-sinon',
            'karma-jasmine',
            'karma-phantomjs-launcher',
            'karma-sourcemap-loader',
            'karma-webpack'
        ],
        reporters: ['mocha'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: ['PhantomJS'],
        singleRun: true,
        client: {
            captureConsole: true
        }
    };
    config.set(_config);
};
//# sourceMappingURL=karma.config.js.map