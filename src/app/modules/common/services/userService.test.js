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
    testing_1.it('signin should use correct url', function () {
        userService.signinUser('', '');
        chai_1.expect(mockBackend.connectionsArray).to.be.length(1);
        chai_1.expect(mockBackend.connectionsArray[0].request.method).to.be.equal(http_1.RequestMethod.Post);
        chai_1.expect(mockBackend.connectionsArray[0].request.url).to.be.equal('/api/login');
    });
    testing_1.it('signin should use correct body', function () {
        var username = 'some username';
        var password = 'some password';
        userService.signinUser(username, password);
        var expectedBody = JSON.stringify({
            username: username,
            password: password
        });
        chai_1.expect(mockBackend.connectionsArray[0].request.getBody()).to.be.equal(expectedBody);
    });
    testing_1.it('register should use correct url', function () {
        userService.registerUser('', '', '', '', '');
        chai_1.expect(mockBackend.connectionsArray).to.be.length(1);
        chai_1.expect(mockBackend.connectionsArray[0].request.method).to.be.equal(http_1.RequestMethod.Post);
        chai_1.expect(mockBackend.connectionsArray[0].request.url).to.be.equal('/api/register');
    });
    testing_1.it('retister should use correct body', function () {
        var username = 'some username';
        var password = 'some password';
        var email = 'some email';
        var firstName = 'some first name';
        var lastName = 'some last name';
        userService.registerUser(username, password, email, firstName, lastName);
        var expectedBody = JSON.stringify({
            username: username,
            password: password,
            email: email,
            firstName: firstName,
            lastName: lastName
        });
        chai_1.expect(mockBackend.connectionsArray[0].request.getBody()).to.be.equal(expectedBody);
    });
    testing_1.it('isUsernameExists should use correct url', function () {
        var username = 'some username';
        userService.isUsernameExists(username);
        chai_1.expect(mockBackend.connectionsArray).to.be.length(1);
        chai_1.expect(mockBackend.connectionsArray[0].request.method).to.be.equal(http_1.RequestMethod.Get);
        chai_1.expect(mockBackend.connectionsArray[0].request.url).to.be.equal('/api/user/' + username + '/exists');
    });
    testing_1.describe('on UNAUTHORIZED error', function () {
        testing_1.beforeEach(function () {
            var error = new httpError_1.HttpError();
            error.status = statusCode_1.StatusCode.UNAUTHORIZED;
            mockBackend.connections.subscribe(function (connection) { return connection.mockError(error); });
        });
        testing_1.it('signin should fail correctly', function () {
            userService.signinUser('', '').subscribe(function () { return chai_1.expect(true, 'should fail').to.be.false; }, function (error) { return chai_1.expect(error).to.be.equal('Invalid credentials'); });
        });
        testing_1.it('register should fail correctly', function () {
            userService.registerUser('', '', '', '', '').subscribe(function () { return chai_1.expect(true, 'should fail').to.be.false; }, function (error) { return chai_1.expect(error).to.be.equal('Oops. Something went wrong. Please try again.'); });
        });
        testing_1.it('isUsernameExists should fail correctly', function () {
            userService.isUsernameExists('').subscribe(function () { return chai_1.expect(true, 'should fail').to.be.false; }, function (error) { return chai_1.expect(error).to.be.equal('Oops. Something went wrong. Please try again.'); });
        });
    });
    testing_1.describe('on INTERNAL_SERVER_ERROR error', function () {
        testing_1.beforeEach(function () {
            var error = new httpError_1.HttpError();
            error.status = statusCode_1.StatusCode.INTERNAL_SERVER_ERROR;
            mockBackend.connections.subscribe(function (connection) { return connection.mockError(error); });
        });
        testing_1.it('signin should fail correctly', function () {
            userService.signinUser('', '').subscribe(function () { return chai_1.expect(true, 'should fail').to.be.false; }, function (error) { return chai_1.expect(error).to.be.equal('Oops. Something went wrong. Please try again.'); });
        });
        testing_1.it('register should fail correctly', function () {
            userService.registerUser('', '', '', '', '').subscribe(function () { return chai_1.expect(true, 'should fail').to.be.false; }, function (error) { return chai_1.expect(error).to.be.equal('Oops. Something went wrong. Please try again.'); });
        });
        testing_1.it('isUsernameExists should fail correctly', function () {
            userService.isUsernameExists('').subscribe(function () { return chai_1.expect(true, 'should fail').to.be.false; }, function (error) { return chai_1.expect(error).to.be.equal('Oops. Something went wrong. Please try again.'); });
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
        testing_1.it('signin should fail correctly', function () {
            userService.signinUser('', '').subscribe(function () { return chai_1.expect(true, 'should fail').to.be.false; }, function (error) { return chai_1.expect(error).to.be.equal('Oops. Something went wrong. Please try again.'); });
        });
        testing_1.it('register should fail correctly', function () {
            userService.registerUser('', '', '', '', '').subscribe(function () { return chai_1.expect(true, 'should fail').to.be.false; }, function (error) { return chai_1.expect(error).to.be.equal('Oops. Something went wrong. Please try again.'); });
        });
        testing_1.it('isUsernameExists should fail correctly', function () {
            userService.isUsernameExists('').subscribe(function () { return chai_1.expect(true, 'should fail').to.be.false; }, function (error) { return chai_1.expect(error).to.be.equal('Oops. Something went wrong. Please try again.'); });
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
            testing_1.it('sigin should fail correctly', function () {
                userService.signinUser('', '').subscribe(function () { return chai_1.expect(true, 'should fail').to.be.false; }, function (error) { return chai_1.expect(error).to.be.equal('Oops. Something went wrong. Please try again.'); });
            });
            testing_1.it('register should fail correctly', function () {
                userService.registerUser('', '', '', '', '').subscribe(function () { return chai_1.expect(true, 'should fail').to.be.false; }, function (error) { return chai_1.expect(error).to.be.equal('Oops. Something went wrong. Please try again.'); });
            });
        });
        testing_1.describe('with redirect-path header', function () {
            var redirectPath;
            testing_1.beforeEach(function () {
                redirectPath = 'some redirect path';
                responseOptions.headers.append('redirect-path', redirectPath);
                mockBackend.connections.subscribe(function (connection) { return connection.mockRespond(response); });
            });
            testing_1.it('signin should return correct path', function () {
                userService.signinUser('', '').subscribe(function (path) { return chai_1.expect(path).to.be.equal(redirectPath); }, function () { return chai_1.expect(true, 'should succeed').to.be.false; });
            });
            testing_1.it('register should return correct path', function () {
                userService.registerUser('', '', '', '', '').subscribe(function (path) { return chai_1.expect(path).to.be.equal(redirectPath); }, function () { return chai_1.expect(true, 'should succeed').to.be.false; });
            });
        });
        testing_1.describe('without the user existsnce result', function () {
            testing_1.beforeEach(function () {
                mockBackend.connections.subscribe(function (connection) { return connection.mockRespond(response); });
            });
            testing_1.it('isUsernameExists should fail correctly', function () {
                userService.isUsernameExists('').subscribe(function () { return chai_1.expect(true, 'should fail').to.be.false; }, function (error) { return chai_1.expect(error).to.be.equal('Oops. Something went wrong. Please try again.'); });
            });
        });
        testing_1.describe('with the user existsnce result', function () {
            var result;
            testing_1.beforeEach(function () {
                result = true;
                responseOptions = new http_2.ResponseOptions({
                    status: statusCode_1.StatusCode.OK,
                    headers: new http_1.Headers(),
                    body: { userExists: result }
                });
                response = new http_2.Response(responseOptions);
                mockBackend.connections.subscribe(function (connection) { return connection.mockRespond(response); });
            });
            testing_1.it('isUsernameExists should return correct value', function () {
                userService.isUsernameExists('').subscribe(function (_result) { return chai_1.expect(_result).to.be.equal(result); }, function () { return chai_1.expect(true, 'should succeed').to.be.false; });
            });
        });
    });
    testing_1.describe('on error with error description', function () {
        var reasonForError;
        testing_1.beforeEach(function () {
            reasonForError = 'some reason';
            var error = new httpError_1.HttpError();
            error.body = { error: reasonForError };
            mockBackend.connections.subscribe(function (connection) { return connection.mockError(error); });
        });
        testing_1.it('register should fail correctly', function () {
            userService.registerUser('', '', '', '', '').subscribe(function () { return chai_1.expect(true, 'should fail').to.be.false; }, function (error) { return chai_1.expect(error).to.be.equal(reasonForError); });
        });
    });
});
//# sourceMappingURL=userService.test.js.map