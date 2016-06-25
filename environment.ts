import {PathHelper} from './src/common/pathHelper';

export interface ICertificate {
  keyFilePath: string,
  certificateFilePath: string
}

export interface IAppConfig {
  hostName: string;
  port: number;
  certificate: ICertificate;
  secret: string;
}

export interface ISessionDatabaseConfig {
  databaseName: string;
  databaseUsername: string;
  databasePassword: string;
  databaseHost: string;
}

export interface IEnvironmentConfig {
  appConfig: IAppConfig;
  sessionDatabaseConfig: ISessionDatabaseConfig;
}

export interface ITestEnvironmentConfig extends IEnvironmentConfig {
  webpackInitializationTimeout: number;
}

export var config = {
  development: <IEnvironmentConfig>{
    appConfig: <IAppConfig>{
      hostName: 'localhost',
      port: 8020,
      certificate: {
        keyFilePath: PathHelper.getPathFromRoot('ssl', 'development-localhost.key'),
        certificateFilePath: PathHelper.getPathFromRoot('ssl', 'development-localhost.cert')
      },
      secret: 'skills_application_secret:712cfb7d-a5fa-4c16-9805-c6da1deb5380'
    },
    sessionDatabaseConfig: <ISessionDatabaseConfig>{
      databaseName: 'skills_development',
      databaseUsername: '',
      databasePassword: '',
      databaseHost: ''
    }
  },
  tests: <ITestEnvironmentConfig>{
    webpackInitializationTimeout: 100000,
    appConfig: <IAppConfig>{
      hostName: 'localhost',
      port: 8020,
      certificate: {
        keyFilePath: PathHelper.getPathFromRoot('ssl', 'development-localhost.key'),
        certificateFilePath: PathHelper.getPathFromRoot('ssl', 'development-localhost.cert')
      },
      secret: 'skills_application_secret:712cfb7d-a5fa-4c16-9805-c6da1deb5380'
    },
    sessionDatabaseConfig: <ISessionDatabaseConfig>{
      databaseName: 'skills_tests',
      databaseUsername: '',
      databasePassword: '',
      databaseHost: ''
    }
  },

  currentEnvironment: 'tests',

  getCurrentEnvironment: function(): IEnvironmentConfig {
    var nodeEnviroment = process.env.NODE_ENV;
    if (nodeEnviroment !== undefined) {
      this.currentEnvironment = nodeEnviroment;
    }

    return this[this.currentEnvironment];
  },
  getSessionDbConnectionString: function(): string {
    var sessionDatabaseConfig: ISessionDatabaseConfig =
      config.getCurrentEnvironment().sessionDatabaseConfig;

    var connectionString =
      'postgres://' +
      sessionDatabaseConfig.databaseUsername + ':' +
      sessionDatabaseConfig.databasePassword + '@' +
      sessionDatabaseConfig.databaseHost + '/' +
      sessionDatabaseConfig.databaseName;

    return connectionString;
  }
}
