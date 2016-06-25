import {config as environmentConfiguration} from '../../../environment';
import {IEnvironmentConfig} from '../../../environment';
import {webpackDevConfig} from './webpack.dev.config';
import {webpackTestConfig} from './webpack.test.config';
import {webpackProductionConfig} from './webpack.production.config';
import {Configuration} from 'webpack';

var environmentConfig: IEnvironmentConfig =
  environmentConfiguration.getCurrentEnvironment();

var config: Configuration;
if (environmentConfig === environmentConfiguration.development) {
  config = webpackDevConfig;
} else if (environmentConfig === environmentConfiguration.tests) {
  config = webpackTestConfig;
} else {
  config = webpackProductionConfig;
}

export var webpackConfig = config;
