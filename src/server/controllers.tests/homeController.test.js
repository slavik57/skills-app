"use strict";
var userLoginManager_1 = require("../testUtils/userLoginManager");
var pageTextResolver_1 = require("../testUtils/pageTextResolver");
var expressSkillsServer_1 = require("../expressSkillsServer");
var chai = require('chai');
var supertest = require('supertest');
var chaiAsPromised = require('chai-as-promised');
var statusCode_1 = require('../enums/statusCode');
var environment_1 = require('../../../environment');
chai.use(chaiAsPromised);
describe('HomeController', function () {
    var expressServer;
    var server;
    before(function (done) {
        this.timeout(environment_1.config.tests.webpackInitializationTimeout);
        expressSkillsServer_1.ExpressSkillsServer.instance.initialize(true)
            .then(function (_expressServer) {
            expressServer = _expressServer;
            server = supertest.agent(expressServer.expressApp);
        })
            .then(function () {
            server.get('/')
                .end(done);
        });
    });
    beforeEach(function () {
        return userLoginManager_1.UserLoginManager.logoutUser(server);
    });
    describe('user not logged in', function () {
        beforeEach(function () {
            this.timeout(environment_1.config.tests.webpackInitializationTimeout);
            return userLoginManager_1.UserLoginManager.logoutUser(server);
        });
        it('home should redirect to signin', function (done) {
            this.timeout(environment_1.config.tests.webpackTestTimeout);
            server.get('/')
                .expect(statusCode_1.StatusCode.REDIRECT)
                .expect('Location', '/signin')
                .end(done);
        });
        it('home/abcd should redirect to signin', function (done) {
            server.get('/abcd')
                .expect(statusCode_1.StatusCode.REDIRECT)
                .expect('Location', '/signin')
                .end(done);
        });
        it('home/dist/app.js should return correct file', function (done) {
            server.get('/dist/app.js')
                .expect(statusCode_1.StatusCode.OK)
                .expect(pageTextResolver_1.PageTextResolver.getFile(expressServer, 'app.js'))
                .end(done);
        });
    });
    describe('user logged in', function () {
        beforeEach(function () {
            return userLoginManager_1.UserLoginManager.loginUser(server);
        });
        it('home should return correct html page', function (done) {
            server.get('/')
                .expect(statusCode_1.StatusCode.OK)
                .expect(pageTextResolver_1.PageTextResolver.getHomePage(expressServer))
                .end(done);
        });
        it('home/abcd should return correct html page', function (done) {
            server.get('/abcd')
                .expect(statusCode_1.StatusCode.OK)
                .expect(pageTextResolver_1.PageTextResolver.getHomePage(expressServer))
                .end(done);
        });
        it('home/dist/app.js should return correct file', function (done) {
            server.get('/dist/app.js')
                .expect(statusCode_1.StatusCode.OK)
                .expect(pageTextResolver_1.PageTextResolver.getFile(expressServer, 'app.js'))
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
            it('home/abcd should redirect to signin', function (done) {
                server.get('/abcd')
                    .expect(statusCode_1.StatusCode.REDIRECT)
                    .expect('Location', '/signin')
                    .end(done);
            });
            it('home/dist/app.js should return correct file', function (done) {
                server.get('/dist/app.js')
                    .expect(statusCode_1.StatusCode.OK)
                    .expect(pageTextResolver_1.PageTextResolver.getFile(expressServer, 'app.js'))
                    .end(done);
            });
        });
    });
});
//# sourceMappingURL=homeController.test.js.map