import {config as environmentConfiguration} from '../../../environment';
import {IEnvironmentConfig} from '../../../environment';
import {webpackDevConfig} from './webpack.dev.config';
import {webpackProductionConfig} from './webpack.production.config';
import {Configuration} from 'webpack';

var environmentConfig: IEnvironmentConfig =
  environmentConfiguration.getCurrentEnvironment();

var config: Configuration;
if (environmentConfig === environmentConfiguration.development) {
  config = webpackDevConfig;
} else {
  config = webpackProductionConfig;
}

export var webpackConfig = config;
