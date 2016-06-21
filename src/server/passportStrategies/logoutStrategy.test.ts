import {UserLoginManager} from "../testUtils/userLoginManager";
import {ExpressSkillsServer} from "../expressSkillsServer";
import * as chai from 'chai';
import { expect } from 'chai';
import * as supertest from 'supertest';
import {SuperTest} from 'supertest';
import * as chaiAsPromised from 'chai-as-promised';
import {StatusCode} from '../enums/statusCode';
import {webpackInitializationTimeout} from '../../../testConfigurations';

chai.use(chaiAsPromised);

describe('ExpressServer', () => {

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
    return UserLoginManager.logoutUser(server);
  });

  describe('user not logged in', () => {

    beforeEach(() => {
      return UserLoginManager.logoutUser(server);
    })

    it('logout should succeed', (done) => {
      server.get('/logout')
        .expect(StatusCode.REDIRECT)
        .expect('Location', '/')
        .end(done);
    });

  });

  describe('user logged in', () => {

    beforeEach(() => {
      return UserLoginManager.loginUser(server);
    });

    it('logout should succeed', (done) => {
      server.get('/logout')
        .expect(StatusCode.REDIRECT)
        .expect('Location', '/')
        .end(done);
    });

    describe('logout', () => {

      beforeEach(() => {
        return UserLoginManager.logoutUser(server);
      });

      it('logout should succeed', (done) => {
        server.get('/logout')
          .expect(StatusCode.REDIRECT)
          .expect('Location', '/')
          .end(done);
      });

    });

  });

});
