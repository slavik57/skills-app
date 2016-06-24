import {LogoutStrategy} from "./passportStrategies/logoutStrategy";
import {FakeLoginStrategy} from "./passportStrategies/fakeLoginStrategy";
import {StatusCode} from "./enums/statusCode";
import {PathHelper} from "../common/pathHelper";
import {webpackConfig} from './webpack.configs/webpack.config';
import {Express, Request, Response, NextFunction} from 'express';
import * as express from 'express';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import * as methodOverride from 'method-override';
import * as passport from 'passport';
import * as expressSession from 'express-session';
import {SessionOptions} from 'express-session';
import * as EnvironmentConfig from "../../environment";
import * as path from 'path';
import * as webpack from 'webpack';
import * as https from 'https';
import {Server} from 'net';
import * as fs from 'fs';
const PostgreSqlStore = require('connect-pg-simple')(expressSession);
const expressControllers = require('express-controller');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

export class ExpressSkillsServer {

  private static _instance: ExpressSkillsServer;
  private _serverDirectory: string;
  private _expressApp: Express;
  private _webpackDevMiddleware: any;
  private _isInitialized: boolean;

  constructor() {
    this._isInitialized = false;

    this._serverDirectory = PathHelper.getPathFromRoot('src', 'server');
    this._expressApp = express();
  }

  public get expressApp(): Express {
    return this._expressApp;
  }

  public get webpackMiddleware(): any {
    return this._webpackDevMiddleware;
  }

  public static get instance(): ExpressSkillsServer {
    if (!this._instance) {
      console.log('Creating express server instance');
      this._instance = new ExpressSkillsServer();
    }

    return this._instance;
  }

  public initialize(useFakeLogin: boolean = false): Promise<ExpressSkillsServer> {
    return this._initializeExpressServer(useFakeLogin);
  }

  public start(): Server {
    var port: number =
      process.env.PORT || EnvironmentConfig.getCurrentEnvironment().appConfig.port;

    var hostName = EnvironmentConfig.getCurrentEnvironment().appConfig.hostName;

    var certificateKeyPath = EnvironmentConfig.getCurrentEnvironment().appConfig.certificate.keyFilePath;
    var certificateFilePath = EnvironmentConfig.getCurrentEnvironment().appConfig.certificate.certificateFilePath;

    var options = {
      key: fs.readFileSync(certificateKeyPath),
      cert: fs.readFileSync(certificateFilePath),
    };

    var server: Server = https.createServer(options, this._expressApp)
      .listen(port, hostName, () => this._logServerIsUp(server.address()));

    return server;
  }

  private _initializeExpressServer(useFakeLogin: boolean): Promise<ExpressSkillsServer> {
    return new Promise((resolveCallback: (value: ExpressSkillsServer) => void) => {
      if (this._isInitialized) {
        resolveCallback(this);
        return;
      }

      this._configureExpress(useFakeLogin);
      this._configureWebpack(() => {
        this._isInitialized = true;

        resolveCallback(this);
      });
    });
  }

  private _configureExpress(useFakeLogin: boolean) {
    this._expressApp.use(cookieParser());
    this._expressApp.use(bodyParser.urlencoded({ extended: false }));
    this._expressApp.use(bodyParser.json());
    this._expressApp.use(methodOverride('X-HTTP-Method-Override'));
    this._configureSession();
    this._configurePassport(useFakeLogin);
    this._configureControllersForApp();
  }

  private _configureSession() {
    var postgreSqlStore = new PostgreSqlStore({
      conString: EnvironmentConfig.getSessionDbConnectionString()
    });

    var options: SessionOptions = {
      secret: EnvironmentConfig.getCurrentEnvironment().appConfig.secret,
      saveUninitialized: true,
      resave: true,
      store: postgreSqlStore
    };

    this._expressApp.use(expressSession(options));
  }

  private _configurePassport(useFakeLogin: boolean) {
    this._expressApp.use(passport.initialize());
    this._expressApp.use(passport.session());

    if (useFakeLogin) {
      FakeLoginStrategy.initialize(this._expressApp);
    }

    LogoutStrategy.initialize(this._expressApp);

    passport.serializeUser((user, done) => { done(null, user); });
    passport.deserializeUser((obj, done) => { done(null, obj); });

    this._expressApp.use(
      (request, response, nextFunction) => this._ensureAuthenticated(request, response, nextFunction));
  }

  private _configureControllersForApp() {
    expressControllers.setDirectory(path.join(this._serverDirectory, 'controllers'))
      .bind(this._expressApp);
  }

  private _ensureAuthenticated(request: Request, response: Response, nextFunction: NextFunction): void {
    if (request.isAuthenticated()) {
      request.path === '/signin' ? response.redirect('/') : nextFunction();
      return;
    }

    if (request.path.indexOf('/dist/') === 0) {
      nextFunction();
      return;
    }

    if (request.path.indexOf('/signin') === 0) {
      request.url = '/signin';
      nextFunction();
      return;
    }

    response.redirect('/signin');
  }

  private _configureWebpack(doneCallback: () => void): void {
    console.log('=== configuring webpack ===');

    var compiler = webpack(webpackConfig);

    this._webpackDevMiddleware = webpackDevMiddleware(compiler, {
      publicPath: webpackConfig.output.publicPath,
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

    this._webpackDevMiddleware.waitUntilValid(() => {
      console.log('=== webpack configuration finished ===');
      doneCallback();
    })
  }

  private _logServerIsUp(serverAddress: { address: string, port: number }) {
    var host = serverAddress.address;
    var port = serverAddress.port;
    console.log("Server is listening at host: %s and port: %s", host, port);
  }
}
