"use strict";
var logoutStrategy_1 = require("./passportStrategies/logoutStrategy");
var fakeLoginStrategy_1 = require("./passportStrategies/fakeLoginStrategy");
var pathHelper_1 = require("../common/pathHelper");
var webpack_config_1 = require('./webpack.configs/webpack.config');
var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var passport = require('passport');
var expressSession = require('express-session');
var EnvironmentConfig = require("../../environment");
var path = require('path');
var webpack = require('webpack');
var https = require('https');
var fs = require('fs');
var PostgreSqlStore = require('connect-pg-simple')(expressSession);
var expressControllers = require('express-controller');
var webpackDevMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');
var ExpressSkillsServer = (function () {
    function ExpressSkillsServer() {
        this._isInitialized = false;
        this._serverDirectory = pathHelper_1.PathHelper.getPathFromRoot('src', 'server');
        this._expressApp = express();
    }
    Object.defineProperty(ExpressSkillsServer.prototype, "expressApp", {
        get: function () {
            return this._expressApp;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ExpressSkillsServer.prototype, "webpackMiddleware", {
        get: function () {
            return this._webpackDevMiddleware;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ExpressSkillsServer, "instance", {
        get: function () {
            if (!this._instance) {
                console.log('Creating express server instance');
                this._instance = new ExpressSkillsServer();
            }
            return this._instance;
        },
        enumerable: true,
        configurable: true
    });
    ExpressSkillsServer.prototype.initialize = function (useFakeLogin) {
        if (useFakeLogin === void 0) { useFakeLogin = false; }
        return this._initializeExpressServer(useFakeLogin);
    };
    ExpressSkillsServer.prototype.start = function () {
        var _this = this;
        var port = process.env.PORT || EnvironmentConfig.getCurrentEnvironment().appConfig.port;
        var hostName = EnvironmentConfig.getCurrentEnvironment().appConfig.hostName;
        var certificateKeyPath = EnvironmentConfig.getCurrentEnvironment().appConfig.certificate.keyFilePath;
        var certificateFilePath = EnvironmentConfig.getCurrentEnvironment().appConfig.certificate.certificateFilePath;
        var options = {
            key: fs.readFileSync(certificateKeyPath),
            cert: fs.readFileSync(certificateFilePath),
        };
        var server = https.createServer(options, this._expressApp)
            .listen(port, hostName, function () { return _this._logServerIsUp(server.address()); });
        return server;
    };
    ExpressSkillsServer.prototype._initializeExpressServer = function (useFakeLogin) {
        var _this = this;
        return new Promise(function (resolveCallback) {
            if (_this._isInitialized) {
                resolveCallback(_this);
                return;
            }
            _this._configureExpress(useFakeLogin);
            _this._configureWebpack(function () {
                _this._isInitialized = true;
                resolveCallback(_this);
            });
        });
    };
    ExpressSkillsServer.prototype._configureExpress = function (useFakeLogin) {
        this._expressApp.use(cookieParser());
        this._expressApp.use(bodyParser.urlencoded({ extended: false }));
        this._expressApp.use(bodyParser.json());
        this._expressApp.use(methodOverride('X-HTTP-Method-Override'));
        this._configureSession();
        this._configurePassport(useFakeLogin);
        this._configureControllersForApp();
    };
    ExpressSkillsServer.prototype._configureSession = function () {
        var postgreSqlStore = new PostgreSqlStore({
            conString: EnvironmentConfig.getDbConnectionString()
        });
        var options = {
            secret: EnvironmentConfig.getCurrentEnvironment().appConfig.secret,
            saveUninitialized: true,
            resave: true,
            store: postgreSqlStore
        };
        this._expressApp.use(expressSession(options));
    };
    ExpressSkillsServer.prototype._configurePassport = function (useFakeLogin) {
        var _this = this;
        this._expressApp.use(passport.initialize());
        this._expressApp.use(passport.session());
        if (useFakeLogin) {
            fakeLoginStrategy_1.FakeLoginStrategy.initialize(this._expressApp);
        }
        logoutStrategy_1.LogoutStrategy.initialize(this._expressApp);
        passport.serializeUser(function (user, done) { done(null, user); });
        passport.deserializeUser(function (obj, done) { done(null, obj); });
        this._expressApp.use(function (request, response, nextFunction) { return _this._ensureAuthenticated(request, response, nextFunction); });
    };
    ExpressSkillsServer.prototype._configureControllersForApp = function () {
        expressControllers.setDirectory(path.join(this._serverDirectory, 'controllers'))
            .bind(this._expressApp);
    };
    ExpressSkillsServer.prototype._ensureAuthenticated = function (request, response, nextFunction) {
        if (request.isAuthenticated()) {
            request.path === '/signin' ? response.redirect('/') : nextFunction();
            return;
        }
        if (request.path.indexOf('/dist/') === 0) {
            nextFunction();
            return;
        }
        if (request.path === '/signin') {
            nextFunction();
            return;
        }
        response.redirect('/signin');
    };
    ExpressSkillsServer.prototype._configureWebpack = function (doneCallback) {
        console.log('=== configuring webpack ===');
        var compiler = webpack(webpack_config_1.webpackConfig);
        this._webpackDevMiddleware = webpackDevMiddleware(compiler, {
            publicPath: webpack_config_1.webpackConfig.output.publicPath,
            contentBase: 'src/app',
            stats: {
                colors: true,
                hash: false,
                timings: true,
                chunks: false,
                chunkModules: false,
                modules: false
            }
        });
        this._expressApp.use(this._webpackDevMiddleware);
        this._expressApp.use(webpackHotMiddleware(compiler));
        this._webpackDevMiddleware.waitUntilValid(function () {
            console.log('=== webpack configuration finished ===');
            doneCallback();
        });
    };
    ExpressSkillsServer.prototype._logServerIsUp = function (serverAddress) {
        var host = serverAddress.address;
        var port = serverAddress.port;
        console.log("Server is listening at host: %s and port: %s", host, port);
    };
    return ExpressSkillsServer;
}());
exports.ExpressSkillsServer = ExpressSkillsServer;
//# sourceMappingURL=expressSkillsServer.js.map