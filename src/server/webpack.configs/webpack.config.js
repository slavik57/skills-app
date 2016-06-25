"use strict";
var environment_1 = require('../../../environment');
var webpack_dev_config_1 = require('./webpack.dev.config');
var webpack_test_config_1 = require('./webpack.test.config');
var webpack_production_config_1 = require('./webpack.production.config');
var environmentConfig = environment_1.config.getCurrentEnvironment();
var config;
if (environmentConfig === environment_1.config.development) {
    config = webpack_dev_config_1.webpackDevConfig;
}
else if (environmentConfig === environment_1.config.tests) {
    config = webpack_test_config_1.webpackTestConfig;
}
else {
    config = webpack_production_config_1.webpackProductionConfig;
}
exports.webpackConfig = config;
//# sourceMappingURL=webpack.config.js.map