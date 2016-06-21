"use strict";
var userLoginManager_1 = require("../testUtils/userLoginManager");
var expressSkillsServer_1 = require("../expressSkillsServer");
var chai = require('chai');
var supertest = require('supertest');
var chaiAsPromised = require('chai-as-promised');
var statusCode_1 = require('../enums/statusCode');
var testConfigurations_1 = require('../../../testConfigurations');
chai.use(chaiAsPromised);
describe('ExpressServer', function () {
    var expressServer;
    var server;
    before(function (done) {
        this.timeout(testConfigurations_1.webpackInitializationTimeout);
        expressSkillsServer_1.ExpressSkillsServer.instance.initialize(true)
            .then(function (_expressServer) {
            expressServer = _expressServer;
            server = supertest.agent(expressServer.expressApp);
            done();
        });
    });
    beforeEach(function () {
        return userLoginManager_1.UserLoginManager.logoutUser(server);
    });
    describe('user not logged in', function () {
        beforeEach(function () {
            return userLoginManager_1.UserLoginManager.logoutUser(server);
        });
        it('logout should succeed', function (done) {
            server.get('/logout')
                .expect(statusCode_1.StatusCode.REDIRECT)
                .expect('Location', '/')
                .end(done);
        });
    });
    describe('user logged in', function () {
        beforeEach(function () {
            return userLoginManager_1.UserLoginManager.loginUser(server);
        });
        it('logout should succeed', function (done) {
            server.get('/logout')
                .expect(statusCode_1.StatusCode.REDIRECT)
                .expect('Location', '/')
                .end(done);
        });
        describe('logout', function () {
            beforeEach(function () {
                return userLoginManager_1.UserLoginManager.logoutUser(server);
            });
            it('logout should succeed', function (done) {
                server.get('/logout')
                    .expect(statusCode_1.StatusCode.REDIRECT)
                    .expect('Location', '/')
                    .end(done);
            });
        });
    });
});
//# sourceMappingURL=logoutStrategy.test.js.map