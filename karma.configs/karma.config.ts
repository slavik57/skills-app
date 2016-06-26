import {webpackTestConfig} from './webpack.test.config';

export var karmaConfig = function(config) {
  var _config = {
    basePath: '',

    frameworks: ['jasmine', 'sinon'],

    files: [
      { pattern: './karma.configs/karma-test-shim.js', watched: false }
    ],

    preprocessors: {
      './karma.configs/karma-test-shim.js': ['webpack', 'sourcemap']
    },

    webpack: webpackTestConfig,

    webpackMiddleware: {
      stats: 'errors-only'
    },

    webpackServer: {
      noInfo: true
    },

    reporters: ['progress'],
    port: 9876,
    colors: true,
    // logLevel: config.LOG_DEBUG,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['PhantomJS'],
    // singleRun: false,
    singleRun: true,
    client: {
      captureConsole: true
    }
  };

  config.set(_config);
};
