"use strict";
var userLoginManager_1 = require("../testUtils/userLoginManager");
var pageTextResolver_1 = require("../testUtils/pageTextResolver");
var expressSkillsServer_1 = require("../expressSkillsServer");
var chai = require('chai');
var supertest = require('supertest');
var chaiAsPromised = require('chai-as-promised');
var statusCode_1 = require('../enums/statusCode');
chai.use(chaiAsPromised);
describe('SigninController', function () {
    var expressServer;
    var server;
    before(function (done) {
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
            return userLoginManager_1.UserLoginManager.logoutUser(server);
        });
        it('signin should return correct html', function (done) {
            server.get('/signin')
                .expect(statusCode_1.StatusCode.OK)
                .expect(pageTextResolver_1.PageTextResolver.getSigninPage(expressServer))
                .end(done);
        });
        it('signin/abcd should return correct html', function (done) {
            server.get('/signin/abcd')
                .expect(statusCode_1.StatusCode.OK)
                .expect(pageTextResolver_1.PageTextResolver.getSigninPage(expressServer))
                .end(done);
        });
    });
    describe('user logged in', function () {
        beforeEach(function () {
            return userLoginManager_1.UserLoginManager.loginUser(server);
        });
        it('singin should redirect to home', function (done) {
            server.get('/signin')
                .expect(statusCode_1.StatusCode.REDIRECT)
                .expect('Location', '/')
                .end(done);
        });
        it('singin/abcd should redirect to home', function (done) {
            server.get('/signin/abcd')
                .expect(statusCode_1.StatusCode.REDIRECT)
                .expect('Location', '/')
                .end(done);
        });
        describe('logout', function () {
            beforeEach(function () {
                return userLoginManager_1.UserLoginManager.logoutUser(server);
            });
            it('signin should return correct html', function (done) {
                server.get('/signin')
                    .expect(statusCode_1.StatusCode.OK)
                    .expect(pageTextResolver_1.PageTextResolver.getSigninPage(expressServer))
                    .end(done);
            });
            it('signin/abcd should return correct html', function (done) {
                server.get('/signin/abcd')
                    .expect(statusCode_1.StatusCode.OK)
                    .expect(pageTextResolver_1.PageTextResolver.getSigninPage(expressServer))
                    .end(done);
            });
        });
    });
});
//# sourceMappingURL=singinController.test.js.map