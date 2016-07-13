"use strict";
var pathHelper_1 = require('./src/common/pathHelper');
exports.config = {
    development: {
        appConfig: {
            hostName: 'localhost',
            port: 8020,
            certificate: {
                keyFilePath: pathHelper_1.PathHelper.getPathFromRoot('ssl', 'development-localhost.key'),
                certificateFilePath: pathHelper_1.PathHelper.getPathFromRoot('ssl', 'development-localhost.cert')
            },
        },
        sessionDatabaseConfig: {
            databaseName: 'skills_development',
            databaseUsername: '',
            databasePassword: '',
            databaseHost: ''
        }
    },
    production: {
        appConfig: {
            hostName: 'localhost',
            port: 8020,
            certificate: {
                keyFilePath: pathHelper_1.PathHelper.getPathFromRoot('ssl', 'development-localhost.key'),
                certificateFilePath: pathHelper_1.PathHelper.getPathFromRoot('ssl', 'development-localhost.cert')
            },
        },
        sessionDatabaseConfig: {
            databaseName: 'skills_production',
            databaseUsername: '',
            databasePassword: '',
            databaseHost: ''
        }
    },
    tests: {
        webpackInitializationTimeout: 100000,
        webpackTestTimeout: 3000,
        appConfig: {
            hostName: 'localhost',
            port: 8020,
            certificate: {
                keyFilePath: pathHelper_1.PathHelper.getPathFromRoot('ssl', 'development-localhost.key'),
                certificateFilePath: pathHelper_1.PathHelper.getPathFromRoot('ssl', 'development-localhost.cert')
            },
        },
        sessionDatabaseConfig: {
            databaseName: 'skills_tests',
            databaseUsername: '',
            databasePassword: '',
            databaseHost: ''
        }
    },
    currentEnvironment: 'tests',
    getCurrentEnvironment: function () {
        var nodeEnviroment = process.env.NODE_ENV;
        if (nodeEnviroment !== undefined) {
            this.currentEnvironment = nodeEnviroment;
        }
        return this[this.currentEnvironment];
    },
    getSessionDbConnectionString: function () {
        var sessionDatabaseConfig = exports.config.getCurrentEnvironment().sessionDatabaseConfig;
        var connectionString = 'postgres://' +
            sessionDatabaseConfig.databaseUsername + ':' +
            sessionDatabaseConfig.databasePassword + '@' +
            sessionDatabaseConfig.databaseHost + '/' +
            sessionDatabaseConfig.databaseName;
        return connectionString;
    }
};
//# sourceMappingURL=environment.js.map