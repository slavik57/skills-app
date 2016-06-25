import {UserLoginManager} from "../testUtils/userLoginManager";
import {FakeLoginStrategy} from "../passportStrategies/fakeLoginStrategy";
import {PageTextResolver} from "../testUtils/pageTextResolver";
import {PathHelper} from "../../common/pathHelper";
import {ExpressSkillsServer} from "../expressSkillsServer";
import * as chai from 'chai';
import { expect } from 'chai';
import * as supertest from 'supertest';
import {SuperTest} from 'supertest';
import * as chaiAsPromised from 'chai-as-promised';
import {StatusCode} from '../enums/statusCode';
import {config as environmentConfiguration} from '../../../environment';

chai.use(chaiAsPromised);

describe('SigninController', () => {

  var expressServer: ExpressSkillsServer;
  var server: SuperTest;

  before(function(done) {
    this.timeout(environmentConfiguration.tests.webpackInitializationTimeout);

    ExpressSkillsServer.instance.initialize(true)
      .then((_expressServer) => {
        expressServer = _expressServer;

        server = supertest.agent(expressServer.expressApp);

        done();
      });
  });

  beforeEach(function() {
    this.timeout(environmentConfiguration.tests.webpackInitializationTimeout);

    return UserLoginManager.logoutUser(server);
  });

  describe('user not logged in', () => {

    beforeEach(() => {
      return UserLoginManager.logoutUser(server);
    })

    it('signin should return correct html', (done) => {
      server.get('/signin')
        .expect(StatusCode.OK)
        .expect(PageTextResolver.getSigninPage(expressServer))
        .end(done);
    });

    it('signin/abcd should return correct html', (done) => {
      server.get('/signin/abcd')
        .expect(StatusCode.OK)
        .expect(PageTextResolver.getSigninPage(expressServer))
        .end(done);
    });

  });

  describe('user logged in', () => {

    beforeEach(() => {
      return UserLoginManager.loginUser(server);
    });

    it('singin should redirect to home', (done) => {
      server.get('/signin')
        .expect(StatusCode.REDIRECT)
        .expect('Location', '/')
        .end(done);
    });

    it('singin/abcd should redirect to home', (done) => {
      server.get('/signin/abcd')
        .expect(StatusCode.REDIRECT)
        .expect('Location', '/')
        .end(done);
    });

    describe('logout', () => {

      beforeEach(() => {
        return UserLoginManager.logoutUser(server);
      });

      it('signin should return correct html', (done) => {
        server.get('/signin')
          .expect(StatusCode.OK)
          .expect(PageTextResolver.getSigninPage(expressServer))
          .end(done);
      });

      it('signin/abcd should return correct html', (done) => {
        server.get('/signin/abcd')
          .expect(StatusCode.OK)
          .expect(PageTextResolver.getSigninPage(expressServer))
          .end(done);
      });

    });

  });

});
