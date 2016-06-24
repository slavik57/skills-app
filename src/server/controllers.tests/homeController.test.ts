import {UserLoginManager} from "../testUtils/userLoginManager";
import {PageTextResolver} from "../testUtils/pageTextResolver";
import {PathHelper} from "../../common/pathHelper";
import {ExpressSkillsServer} from "../expressSkillsServer";
import * as chai from 'chai';
import { expect } from 'chai';
import * as supertest from 'supertest';
import {SuperTest} from 'supertest';
import * as chaiAsPromised from 'chai-as-promised';
import {StatusCode} from '../enums/statusCode';
import {webpackInitializationTimeout} from '../../../testConfigurations';

chai.use(chaiAsPromised);

describe('HomeController', () => {

  var expressServer: ExpressSkillsServer;
  var server: SuperTest;

  before(function(done) {
    this.timeout(webpackInitializationTimeout);

    ExpressSkillsServer.instance.initialize(true)
      .then((_expressServer) => {
        expressServer = _expressServer;

        server = supertest.agent(expressServer.expressApp);

        done();
      });
  });

  beforeEach(function() {
    this.timeout(webpackInitializationTimeout);

    return UserLoginManager.logoutUser(server);
  });

  describe('user not logged in', () => {

    beforeEach(() => {
      return UserLoginManager.logoutUser(server);
    });

    it('home should redirect to signin', (done) => {
      server.get('/')
        .expect(StatusCode.REDIRECT)
        .expect('Location', '/signin')
        .end(done);
    });

  });

  describe('user logged in', () => {

    beforeEach(() => {
      return UserLoginManager.loginUser(server);
    });

    it('home should return html page', (done) => {
      server.get('/')
        .expect(StatusCode.OK)
        .expect(PageTextResolver.getHomePage(expressServer))
        .end(done);
    });

    describe('logout', () => {

      beforeEach(() => {
        return UserLoginManager.logoutUser(server);
      });

      it('home should redirect to signin', (done) => {
        server.get('/')
          .expect(StatusCode.REDIRECT)
          .expect('Location', '/signin')
          .end(done);
      });

    });

  });

});
