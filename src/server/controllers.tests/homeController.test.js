"use strict";
var userLoginManager_1 = require("../testUtils/userLoginManager");
var pageTextResolver_1 = require("../testUtils/pageTextResolver");
var expressSkillsServer_1 = require("../expressSkillsServer");
var chai = require('chai');
var supertest = require('supertest');
var chaiAsPromised = require('chai-as-promised');
var statusCode_1 = require('../enums/statusCode');
var testConfigurations_1 = require('../../../testConfigurations');
chai.use(chaiAsPromised);
describe('HomeController', function () {
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
        this.timeout(testConfigurations_1.webpackInitializationTimeout);
        return userLoginManager_1.UserLoginManager.logoutUser(server);
    });
    describe('user not logged in', function () {
        beforeEach(function () {
            return userLoginManager_1.UserLoginManager.logoutUser(server);
        });
        it('home should redirect to signin', function (done) {
            server.get('/')
                .expect(statusCode_1.StatusCode.REDIRECT)
                .expect('Location', '/signin')
                .end(done);
        });
    });
    describe('user logged in', function () {
        beforeEach(function () {
            return userLoginManager_1.UserLoginManager.loginUser(server);
        });
        it('home should return html page', function (done) {
            server.get('/')
                .expect(statusCode_1.StatusCode.OK)
                .expect(pageTextResolver_1.PageTextResolver.getHomePage(expressServer))
                .end(done);
        });
        describe('logout', function () {
            beforeEach(function () {
                return userLoginManager_1.UserLoginManager.logoutUser(server);
            });
            it('home should redirect to signin', function (done) {
                server.get('/')
                    .expect(statusCode_1.StatusCode.REDIRECT)
                    .expect('Location', '/signin')
                    .end(done);
            });
        });
    });
});
//# sourceMappingURL=homeController.test.js.map