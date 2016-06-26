"use strict";
var httpError_1 = require("../errors/httpError");
var statusCode_1 = require("../../../../common/statusCode");
var testing_1 = require('@angular/core/testing');
var http_1 = require('@angular/http');
var core_1 = require('@angular/core');
var testing_2 = require('@angular/http/testing');
var http_2 = require('@angular/http');
var chai_1 = require('chai');
var userService_1 = require('./userService');
testing_1.describe('UserService', function () {
    var userService;
    var mockBackend;
    testing_1.beforeEachProviders(function () { return [
        http_1.HTTP_PROVIDERS,
        testing_2.MockBackend,
        core_1.provide(http_1.XHRBackend, { useExisting: testing_2.MockBackend }),
        userService_1.UserService
    ]; });
    testing_1.beforeEach(testing_1.inject([testing_2.MockBackend, userService_1.UserService], function (_mockBackend, _userService) {
        userService = _userService;
        mockBackend = _mockBackend;
    }));
    testing_1.describe('on UNAUTHORIZED error', function () {
        testing_1.beforeEach(function () {
            var error = new httpError_1.HttpError();
            error.status = statusCode_1.StatusCode.UNAUTHORIZED;
            mockBackend.connections.subscribe(function (connection) { return connection.mockError(error); });
        });
        testing_1.it('should fail correctly', function () {
            userService.signinUser('', '').subscribe(function () { return chai_1.expect(true, 'should fail').to.be.false; }, function (error) { return chai_1.expect(error).to.be.equal('Invalid credentials'); });
        });
    });
    testing_1.describe('on INTERNAL_SERVER_ERROR error', function () {
        testing_1.beforeEach(function () {
            var error = new httpError_1.HttpError();
            error.status = statusCode_1.StatusCode.INTERNAL_SERVER_ERROR;
            mockBackend.connections.subscribe(function (connection) { return connection.mockError(error); });
        });
        testing_1.it('should fail correctly', function () {
            userService.signinUser('', '').subscribe(function () { return chai_1.expect(true, 'should fail').to.be.false; }, function (error) { return chai_1.expect(error).to.be.equal('Oops. Something went wrong. Please try again.'); });
        });
    });
    testing_1.describe('on success with UNAUTHORIZED', function () {
        testing_1.beforeEach(function () {
            var responseOptions = new http_2.ResponseOptions({
                status: statusCode_1.StatusCode.UNAUTHORIZED
            });
            var response = new http_2.Response(responseOptions);
            mockBackend.connections.subscribe(function (connection) { return connection.mockRespond(response); });
        });
        testing_1.it('should fail correctly', function () {
            userService.signinUser('', '').subscribe(function () { return chai_1.expect(true, 'should fail').to.be.false; }, function (error) { return chai_1.expect(error).to.be.equal('Oops. Something went wrong. Please try again.'); });
        });
    });
    testing_1.describe('on success with OK', function () {
        var responseOptions;
        var response;
        testing_1.beforeEach(function () {
            responseOptions = new http_2.ResponseOptions({
                status: statusCode_1.StatusCode.OK,
                headers: new http_1.Headers()
            });
            response = new http_2.Response(responseOptions);
        });
        testing_1.describe('without redirect-path header', function () {
            testing_1.beforeEach(function () {
                mockBackend.connections.subscribe(function (connection) { return connection.mockRespond(response); });
            });
            testing_1.it('should fail correctly', function () {
                userService.signinUser('', '').subscribe(function () { return chai_1.expect(true, 'should fail').to.be.false; }, function (error) { return chai_1.expect(error).to.be.equal('Oops. Something went wrong. Please try again.'); });
            });
        });
        testing_1.describe('with redirect-path header', function () {
            var redirectPath;
            testing_1.beforeEach(function () {
                redirectPath = 'some redirect path';
                responseOptions.headers.append('redirect-path', redirectPath);
                mockBackend.connections.subscribe(function (connection) { return connection.mockRespond(response); });
            });
            testing_1.it('should return correct path', function () {
                userService.signinUser('', '').subscribe(function (path) { return chai_1.expect(path).to.be.equal(redirectPath); }, function () { return chai_1.expect(true, 'should succeed').to.be.false; });
            });
        });
    });
});
//# sourceMappingURL=userService.test.js.map