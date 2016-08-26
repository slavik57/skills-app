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
        chai_1.expect(mockBackend.connectionsArray[0].request.url).to.be.equal('/api/users/' + username + '/exists');
    });
    testing_1.it('canUserUpdatePassword should use correct url', function () {
        var userId = 123;
        userService.canUserUpdatePassword(userId);
        chai_1.expect(mockBackend.connectionsArray).to.be.length(1);
        chai_1.expect(mockBackend.connectionsArray[0].request.method).to.be.equal(http_1.RequestMethod.Get);
        chai_1.expect(mockBackend.connectionsArray[0].request.url).to.be.equal('/api/user/' + userId + '/can-update-password');
    });
    testing_1.it('canUserModifyTeams should use correct url', function () {
        userService.canUserModifyTeams();
        chai_1.expect(mockBackend.connectionsArray).to.be.length(1);
        chai_1.expect(mockBackend.connectionsArray[0].request.method).to.be.equal(http_1.RequestMethod.Get);
        chai_1.expect(mockBackend.connectionsArray[0].request.url).to.be.equal('/api/user/can-modify-teams-list');
    });
    testing_1.it('getUserDetails should use correct url', function () {
        var username = 'some username';
        userService.getUserDetails();
        chai_1.expect(mockBackend.connectionsArray).to.be.length(1);
        chai_1.expect(mockBackend.connectionsArray[0].request.method).to.be.equal(http_1.RequestMethod.Get);
        chai_1.expect(mockBackend.connectionsArray[0].request.url).to.be.equal('/api/user/');
    });
    testing_1.describe('getUsersDetailsByPartialUsername', function () {
        testing_1.it('should use correct url', function () {
            var username = 'some username';
            var max = 3;
            userService.getUsersDetailsByPartialUsername(username, max);
            chai_1.expect(mockBackend.connectionsArray).to.be.length(1);
            chai_1.expect(mockBackend.connectionsArray[0].request.method).to.be.equal(http_1.RequestMethod.Get);
            chai_1.expect(mockBackend.connectionsArray[0].request.url).to.be.equal('/api/users/filtered/' + username + '?max=' + max);
        });
        testing_1.it('without limit should use correct url', function () {
            var username = 'some username';
            userService.getUsersDetailsByPartialUsername(username);
            chai_1.expect(mockBackend.connectionsArray).to.be.length(1);
            chai_1.expect(mockBackend.connectionsArray[0].request.method).to.be.equal(http_1.RequestMethod.Get);
            chai_1.expect(mockBackend.connectionsArray[0].request.url).to.be.equal('/api/users/filtered/' + username);
        });
    });
    testing_1.it('updateUserDetails should use correct url', function () {
        var id = 123;
        userService.updateUserDetails(id, '', '', '', '');
        chai_1.expect(mockBackend.connectionsArray).to.be.length(1);
        chai_1.expect(mockBackend.connectionsArray[0].request.method).to.be.equal(http_1.RequestMethod.Put);
        chai_1.expect(mockBackend.connectionsArray[0].request.url).to.be.equal('/api/user/' + id);
    });
    testing_1.it('register should use correct body', function () {
        var id = 123;
        var username = 'some username';
        var email = 'some email';
        var firstName = 'some first name';
        var lastName = 'some last name';
        userService.updateUserDetails(id, username, email, firstName, lastName);
        var expectedBody = JSON.stringify({
            username: username,
            email: email,
            firstName: firstName,
            lastName: lastName
        });
        chai_1.expect(mockBackend.connectionsArray[0].request.getBody()).to.be.equal(expectedBody);
    });
    testing_1.it('updateUserPassword should use correct url', function () {
        var id = 123;
        userService.updateUserPassword(id, '', '');
        chai_1.expect(mockBackend.connectionsArray).to.be.length(1);
        chai_1.expect(mockBackend.connectionsArray[0].request.method).to.be.equal(http_1.RequestMethod.Put);
        chai_1.expect(mockBackend.connectionsArray[0].request.url).to.be.equal('/api/user/' + id + '/password');
    });
    testing_1.it('getUsersDetails should use correct url', function () {
        userService.getUsersDetails();
        chai_1.expect(mockBackend.connectionsArray).to.be.length(1);
        chai_1.expect(mockBackend.connectionsArray[0].request.method).to.be.equal(http_1.RequestMethod.Get);
        chai_1.expect(mockBackend.connectionsArray[0].request.url).to.be.equal('/api/users/');
    });
    testing_1.it('getUserPermissions should use correct url', function () {
        var userId = 1234321;
        userService.getUserPermissions(userId);
        chai_1.expect(mockBackend.connectionsArray).to.be.length(1);
        chai_1.expect(mockBackend.connectionsArray[0].request.method).to.be.equal(http_1.RequestMethod.Get);
        chai_1.expect(mockBackend.connectionsArray[0].request.url).to.be.equal('/api/users/' + userId + '/permissions');
    });
    testing_1.it('getUserPermissionsModificationRules should use correct url', function () {
        userService.getUserPermissionsModificationRules();
        chai_1.expect(mockBackend.connectionsArray).to.be.length(1);
        chai_1.expect(mockBackend.connectionsArray[0].request.method).to.be.equal(http_1.RequestMethod.Get);
        chai_1.expect(mockBackend.connectionsArray[0].request.url).to.be.equal('/api/user/permissions-modification-rules');
    });
    testing_1.describe('updateUserPermissions', function () {
        testing_1.it('updateUserPermissions should use correct url', function () {
            var id = 123;
            userService.updateUserPermissions(id, [], []);
            chai_1.expect(mockBackend.connectionsArray).to.be.length(1);
            chai_1.expect(mockBackend.connectionsArray[0].request.method).to.be.equal(http_1.RequestMethod.Put);
            chai_1.expect(mockBackend.connectionsArray[0].request.url).to.be.equal('/api/users/' + id + '/permissions');
        });
        testing_1.it('updateUserPermissions should use correct body', function () {
            var id = 123;
            var permissionsToAdd = [
                { value: 1, name: 'name1', description: 'description1' },
                { value: 2, name: 'name2', description: 'description2' }
            ];
            var permissionsToRemove = [
                { value: 3, name: 'name3', description: 'description3' },
                { value: 4, name: 'name4', description: 'description4' }
            ];
            userService.updateUserPermissions(id, permissionsToAdd, permissionsToRemove);
            var expectedBody = JSON.stringify({
                permissionsToAdd: [1, 2],
                permissionsToRemove: [3, 4]
            });
            chai_1.expect(mockBackend.connectionsArray[0].request.getBody()).to.be.equal(expectedBody);
        });
    });
    testing_1.it('getTeamModificationPermissions should use correct url', function () {
        var teamId = 123321;
        userService.getTeamModificationPermissions(teamId);
        chai_1.expect(mockBackend.connectionsArray).to.be.length(1);
        chai_1.expect(mockBackend.connectionsArray[0].request.method).to.be.equal(http_1.RequestMethod.Get);
        chai_1.expect(mockBackend.connectionsArray[0].request.url).to.be.equal("/api/user/team-modification-permissions/" + teamId);
    });
    var failingTests = function (beforeEachFunc, expectedError) {
        return function () {
            testing_1.beforeEach(beforeEachFunc);
            testing_1.it('signin should fail correctly', function () {
                userService.signinUser('', '').subscribe(function () { return chai_1.expect(true, 'should fail').to.be.false; }, function (error) { return chai_1.expect(error).to.be.equal(expectedError); });
            });
            testing_1.it('register should fail correctly', function () {
                userService.registerUser('', '', '', '', '').subscribe(function () { return chai_1.expect(true, 'should fail').to.be.false; }, function (error) { return chai_1.expect(error).to.be.equal(expectedError); });
            });
            testing_1.it('isUsernameExists should fail correctly', function () {
                userService.isUsernameExists('').subscribe(function () { return chai_1.expect(true, 'should fail').to.be.false; }, function (error) { return chai_1.expect(error).to.be.equal(expectedError); });
            });
            testing_1.it('canUserUpdatePassword should fail correctly', function () {
                userService.canUserUpdatePassword(1).subscribe(function () { return chai_1.expect(true, 'should fail').to.be.false; }, function (error) { return chai_1.expect(error).to.be.equal(expectedError); });
            });
            testing_1.it('canUserModifyTeams should fail correctly', function () {
                userService.canUserModifyTeams().subscribe(function () { return chai_1.expect(true, 'should fail').to.be.false; }, function (error) { return chai_1.expect(error).to.be.equal(expectedError); });
            });
            testing_1.it('getUserDetails should fail correctly', function () {
                userService.getUserDetails().subscribe(function () { return chai_1.expect(true, 'should fail').to.be.false; }, function (error) { return chai_1.expect(error).to.be.equal(expectedError); });
            });
            testing_1.it('updateUserDetails should fail correctly', function () {
                userService.updateUserDetails(1, '', '', '', '').subscribe(function () { return chai_1.expect(true, 'should fail').to.be.false; }, function (error) { return chai_1.expect(error).to.be.equal(expectedError); });
            });
            testing_1.it('updateUserPassword should fail correctly', function () {
                userService.updateUserPassword(1, '', '').subscribe(function () { return chai_1.expect(true, 'should fail').to.be.false; }, function (error) { return chai_1.expect(error).to.be.equal(expectedError); });
            });
            testing_1.it('getUsersDetails should fail correctly', function () {
                userService.getUsersDetails().subscribe(function () { return chai_1.expect(true, 'should fail').to.be.false; }, function (error) { return chai_1.expect(error).to.be.equal(expectedError); });
            });
            testing_1.it('getUserPermissions should fail correctly', function () {
                userService.getUserPermissions(1).subscribe(function () { return chai_1.expect(true, 'should fail').to.be.false; }, function (error) { return chai_1.expect(error).to.be.equal(expectedError); });
            });
            testing_1.it('getUserPermissionsModificationRules should fail correctly', function () {
                userService.getUserPermissionsModificationRules().subscribe(function () { return chai_1.expect(true, 'should fail').to.be.false; }, function (error) { return chai_1.expect(error).to.be.equal(expectedError); });
            });
            testing_1.it('updateUserPermissions should fail correctly', function () {
                userService.updateUserPermissions(1, [], []).subscribe(function () { return chai_1.expect(true, 'should fail').to.be.false; }, function (error) { return chai_1.expect(error).to.be.equal(expectedError); });
            });
            testing_1.it('getTeamModificationPermissions should fail correctly', function () {
                userService.getTeamModificationPermissions(1).subscribe(function () { return chai_1.expect(true, 'should fail').to.be.false; }, function (error) { return chai_1.expect(error).to.be.equal(expectedError); });
            });
        };
    };
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
            userService.registerUser('', '', '', '', '').subscribe(function () { return chai_1.expect(true, 'should fail').to.be.false; }, function (error) { return chai_1.expect(error).to.be.equal('Unauthorized'); });
        });
        testing_1.it('isUsernameExists should fail correctly', function () {
            userService.isUsernameExists('').subscribe(function () { return chai_1.expect(true, 'should fail').to.be.false; }, function (error) { return chai_1.expect(error).to.be.equal('Oops. Something went wrong. Please try again'); });
        });
        testing_1.it('canUserUpdatePassword should fail correctly', function () {
            userService.canUserUpdatePassword(1).subscribe(function () { return chai_1.expect(true, 'should fail').to.be.false; }, function (error) { return chai_1.expect(error).to.be.equal('Oops. Something went wrong. Please try again'); });
        });
        testing_1.it('canUserModifyTeams should fail correctly', function () {
            userService.canUserModifyTeams().subscribe(function () { return chai_1.expect(true, 'should fail').to.be.false; }, function (error) { return chai_1.expect(error).to.be.equal('Oops. Something went wrong. Please try again'); });
        });
        testing_1.it('getUserDetails should fail correctly', function () {
            userService.getUserDetails().subscribe(function () { return chai_1.expect(true, 'should fail').to.be.false; }, function (error) { return chai_1.expect(error).to.be.equal('Unauthorized'); });
        });
        testing_1.it('updateUserDetails should fail correctly', function () {
            userService.updateUserDetails(1, '', '', '', '').subscribe(function () { return chai_1.expect(true, 'should fail').to.be.false; }, function (error) { return chai_1.expect(error).to.be.equal('Unauthorized'); });
        });
        testing_1.it('updateUserPassword should fail correctly', function () {
            userService.updateUserPassword(1, '', '').subscribe(function () { return chai_1.expect(true, 'should fail').to.be.false; }, function (error) { return chai_1.expect(error).to.be.equal('Unauthorized'); });
        });
        testing_1.it('getUsersDetails should fail correctly', function () {
            userService.getUsersDetails().subscribe(function () { return chai_1.expect(true, 'should fail').to.be.false; }, function (error) { return chai_1.expect(error).to.be.equal('Unauthorized'); });
        });
        testing_1.it('getUserPermissions should fail correctly', function () {
            userService.getUserPermissions(1).subscribe(function () { return chai_1.expect(true, 'should fail').to.be.false; }, function (error) { return chai_1.expect(error).to.be.equal('Unauthorized'); });
        });
        testing_1.it('getUserPermissionsModificationRules should fail correctly', function () {
            userService.getUserPermissionsModificationRules().subscribe(function () { return chai_1.expect(true, 'should fail').to.be.false; }, function (error) { return chai_1.expect(error).to.be.equal('Unauthorized'); });
        });
        testing_1.it('updateUserPermissions should fail correctly', function () {
            userService.updateUserPermissions(1, [], []).subscribe(function () { return chai_1.expect(true, 'should fail').to.be.false; }, function (error) { return chai_1.expect(error).to.be.equal('Unauthorized'); });
        });
        testing_1.it('getTeamModificationPermissions should fail correctly', function () {
            userService.getTeamModificationPermissions(1).subscribe(function () { return chai_1.expect(true, 'should fail').to.be.false; }, function (error) { return chai_1.expect(error).to.be.equal('Unauthorized'); });
        });
    });
    testing_1.describe('on INTERNAL_SERVER_ERROR error', failingTests(function () {
        var error = new httpError_1.HttpError();
        error.status = statusCode_1.StatusCode.INTERNAL_SERVER_ERROR;
        mockBackend.connections.subscribe(function (connection) { return connection.mockError(error); });
    }, 'Oops. Something went wrong. Please try again'));
    testing_1.describe('on error with failing json method', failingTests(function () {
        var error = new httpError_1.HttpError();
        error.json = function () { throw 'fail to parse'; };
        error.status = statusCode_1.StatusCode.NOT_FOUND;
        mockBackend.connections.subscribe(function (connection) { return connection.mockError(error); });
    }, 'Oops. Something went wrong. Please try again'));
    testing_1.describe('on success with UNAUTHORIZED', failingTests(function () {
        var responseOptions = new http_2.ResponseOptions({
            status: statusCode_1.StatusCode.UNAUTHORIZED
        });
        var response = new http_2.Response(responseOptions);
        mockBackend.connections.subscribe(function (connection) { return connection.mockRespond(response); });
    }, 'Oops. Something went wrong. Please try again'));
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
        testing_1.it('updateUserDetails should fail correctly', function () {
            userService.updateUserDetails(1, '', '', '', '').subscribe(function () { return chai_1.expect(true, 'should fail').to.be.false; }, function (error) { return chai_1.expect(error).to.be.equal(reasonForError); });
        });
        testing_1.it('updateUserPassword should fail correctly', function () {
            userService.updateUserDetails(1, '', '', '', '').subscribe(function () { return chai_1.expect(true, 'should fail').to.be.false; }, function (error) { return chai_1.expect(error).to.be.equal(reasonForError); });
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
        testing_1.it('updateUserDetails should succeed', function () {
            mockBackend.connections.subscribe(function (connection) { return connection.mockRespond(response); });
            var wasResolved = false;
            userService.updateUserDetails(1, '', '', '', '').subscribe(function () { wasResolved = true; }, function () { return chai_1.expect(true, 'should succeed').to.be.false; });
            chai_1.expect(wasResolved).to.be.true;
        });
        testing_1.it('updateUserPassword should succeed', function () {
            mockBackend.connections.subscribe(function (connection) { return connection.mockRespond(response); });
            var wasResolved = false;
            userService.updateUserPassword(1, '', '').subscribe(function () { wasResolved = true; }, function () { return chai_1.expect(true, 'should succeed').to.be.false; });
            chai_1.expect(wasResolved).to.be.true;
        });
        testing_1.describe('signin/register', function () {
            testing_1.describe('without redirect-path header', function () {
                testing_1.beforeEach(function () {
                    mockBackend.connections.subscribe(function (connection) { return connection.mockRespond(response); });
                });
                testing_1.it('sigin should fail correctly', function () {
                    userService.signinUser('', '').subscribe(function () { return chai_1.expect(true, 'should fail').to.be.false; }, function (error) { return chai_1.expect(error).to.be.equal('Oops. Something went wrong. Please try again'); });
                });
                testing_1.it('register should fail correctly', function () {
                    userService.registerUser('', '', '', '', '').subscribe(function () { return chai_1.expect(true, 'should fail').to.be.false; }, function (error) { return chai_1.expect(error).to.be.equal('Oops. Something went wrong. Please try again'); });
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
        });
        testing_1.describe('isUsernameExists', function () {
            testing_1.it('without the user existance result isUsernameExists should fail correctly', function () {
                mockBackend.connections.subscribe(function (connection) { return connection.mockRespond(response); });
                userService.isUsernameExists('').subscribe(function () { return chai_1.expect(true, 'should fail').to.be.false; }, function (error) { return chai_1.expect(error).to.be.equal('Oops. Something went wrong. Please try again'); });
            });
            testing_1.it('with the user existance result isUsernameExists should return correct value', function () {
                var result = true;
                responseOptions = new http_2.ResponseOptions({
                    status: statusCode_1.StatusCode.OK,
                    headers: new http_1.Headers(),
                    body: { userExists: result }
                });
                response = new http_2.Response(responseOptions);
                mockBackend.connections.subscribe(function (connection) { return connection.mockRespond(response); });
                userService.isUsernameExists('').subscribe(function (_result) { return chai_1.expect(_result).to.be.equal(result); }, function () { return chai_1.expect(true, 'should succeed').to.be.false; });
            });
        });
        testing_1.describe('canUserUpdatePassword', function () {
            testing_1.it('without the expected result canUserUpdatePassword should fail correctly', function () {
                mockBackend.connections.subscribe(function (connection) { return connection.mockRespond(response); });
                userService.canUserUpdatePassword(1).subscribe(function () { return chai_1.expect(true, 'should fail').to.be.false; }, function (error) { return chai_1.expect(error).to.be.equal('Oops. Something went wrong. Please try again'); });
            });
            testing_1.it('with the expected result canUserUpdatePassword should return correct value', function () {
                var result = true;
                responseOptions = new http_2.ResponseOptions({
                    status: statusCode_1.StatusCode.OK,
                    headers: new http_1.Headers(),
                    body: { canUpdatePassword: result }
                });
                response = new http_2.Response(responseOptions);
                mockBackend.connections.subscribe(function (connection) { return connection.mockRespond(response); });
                userService.canUserUpdatePassword(1).subscribe(function (_result) { return chai_1.expect(_result).to.be.equal(result); }, function () { return chai_1.expect(true, 'should succeed').to.be.false; });
            });
        });
        testing_1.describe('getUserDetails', function () {
            testing_1.it('without the user details result getUserDetails should fail correctly', function () {
                mockBackend.connections.subscribe(function (connection) { return connection.mockRespond(response); });
                userService.getUserDetails().subscribe(function () { return chai_1.expect(true, 'should fail').to.be.false; }, function (error) { return chai_1.expect(error).to.be.equal('Oops. Something went wrong. Please try again'); });
            });
            testing_1.it('with partial user details result getUserDetails should fail correctly', function () {
                var result = {
                    id: 1,
                    username: 'some username',
                    email: 'some email',
                    firstName: 'some name',
                    lastName: 'some last name'
                };
                delete result.lastName;
                responseOptions = new http_2.ResponseOptions({
                    status: statusCode_1.StatusCode.OK,
                    headers: new http_1.Headers(),
                    body: result
                });
                response = new http_2.Response(responseOptions);
                mockBackend.connections.subscribe(function (connection) { return connection.mockRespond(response); });
                userService.getUserDetails().subscribe(function () { return chai_1.expect(true, 'should fail').to.be.false; }, function (error) { return chai_1.expect(error).to.be.equal('Oops. Something went wrong. Please try again'); });
            });
            testing_1.it('with the user details result and some fields empty getUserDetails should return correct value', function () {
                var result = {
                    id: 1,
                    username: 'some username',
                    email: null,
                    firstName: '',
                    lastName: 'some last name'
                };
                responseOptions = new http_2.ResponseOptions({
                    status: statusCode_1.StatusCode.OK,
                    headers: new http_1.Headers(),
                    body: result
                });
                response = new http_2.Response(responseOptions);
                mockBackend.connections.subscribe(function (connection) { return connection.mockRespond(response); });
                userService.getUserDetails().subscribe(function (_result) { return chai_1.expect(_result).to.be.deep.equal(result); }, function () { return chai_1.expect(true, 'should succeed').to.be.false; });
            });
            testing_1.it('with the user details result getUserDetails should return correct value', function () {
                var result = {
                    id: 1,
                    username: 'some username',
                    email: 'some email',
                    firstName: 'some name',
                    lastName: 'some last name'
                };
                responseOptions = new http_2.ResponseOptions({
                    status: statusCode_1.StatusCode.OK,
                    headers: new http_1.Headers(),
                    body: result
                });
                response = new http_2.Response(responseOptions);
                mockBackend.connections.subscribe(function (connection) { return connection.mockRespond(response); });
                userService.getUserDetails().subscribe(function (_result) { return chai_1.expect(_result).to.be.deep.equal(result); }, function () { return chai_1.expect(true, 'should succeed').to.be.false; });
            });
            testing_1.it('without email in the user details result getUserDetails should return correct user details', function () {
                var result = {
                    id: 1,
                    username: 'some username',
                    email: 'some email',
                    firstName: 'some name',
                    lastName: 'some last name'
                };
                delete result.email;
                responseOptions = new http_2.ResponseOptions({
                    status: statusCode_1.StatusCode.OK,
                    headers: new http_1.Headers(),
                    body: result
                });
                response = new http_2.Response(responseOptions);
                mockBackend.connections.subscribe(function (connection) { return connection.mockRespond(response); });
                userService.getUserDetails().subscribe(function (_result) { return chai_1.expect(_result).to.be.deep.equal(result); }, function () { return chai_1.expect(true, 'should succeed').to.be.false; });
            });
        });
        testing_1.describe('getUsersDetails', function () {
            testing_1.it('without the user details result getUsersDetails should fail correctly', function () {
                mockBackend.connections.subscribe(function (connection) { return connection.mockRespond(response); });
                userService.getUsersDetails().subscribe(function () { return chai_1.expect(true, 'should fail').to.be.false; }, function (error) { return chai_1.expect(error).to.be.equal('Oops. Something went wrong. Please try again'); });
            });
            testing_1.it('with partial user details result getUsersDetails should fail correctly', function () {
                var result = {
                    id: 1,
                    username: 'some username'
                };
                delete result.username;
                responseOptions = new http_2.ResponseOptions({
                    status: statusCode_1.StatusCode.OK,
                    headers: new http_1.Headers(),
                    body: [result]
                });
                response = new http_2.Response(responseOptions);
                mockBackend.connections.subscribe(function (connection) { return connection.mockRespond(response); });
                userService.getUsersDetails().subscribe(function () { return chai_1.expect(true, 'should fail').to.be.false; }, function (error) { return chai_1.expect(error).to.be.equal('Oops. Something went wrong. Please try again'); });
            });
            testing_1.it('with the user details result and empty username getUsersDetails should return fail correctly', function () {
                var result = {
                    id: 1,
                    username: '',
                };
                responseOptions = new http_2.ResponseOptions({
                    status: statusCode_1.StatusCode.OK,
                    headers: new http_1.Headers(),
                    body: [result]
                });
                response = new http_2.Response(responseOptions);
                mockBackend.connections.subscribe(function (connection) { return connection.mockRespond(response); });
                userService.getUsersDetails().subscribe(function () { return chai_1.expect(true, 'should fail').to.be.false; }, function (error) { return chai_1.expect(error).to.be.equal('Oops. Something went wrong. Please try again'); });
            });
            testing_1.it('with the user details result and null id getUsersDetails should return fail correctly', function () {
                var result = {
                    id: null,
                    username: 'some username',
                };
                responseOptions = new http_2.ResponseOptions({
                    status: statusCode_1.StatusCode.OK,
                    headers: new http_1.Headers(),
                    body: [result]
                });
                response = new http_2.Response(responseOptions);
                mockBackend.connections.subscribe(function (connection) { return connection.mockRespond(response); });
                userService.getUsersDetails().subscribe(function () { return chai_1.expect(true, 'should fail').to.be.false; }, function (error) { return chai_1.expect(error).to.be.equal('Oops. Something went wrong. Please try again'); });
            });
            testing_1.it('with the user details result getUsersDetails should return correct value', function () {
                var result = [
                    {
                        id: 1,
                        username: 'some username',
                    },
                    {
                        id: 2,
                        username: 'some other username',
                    }
                ];
                responseOptions = new http_2.ResponseOptions({
                    status: statusCode_1.StatusCode.OK,
                    headers: new http_1.Headers(),
                    body: result
                });
                response = new http_2.Response(responseOptions);
                mockBackend.connections.subscribe(function (connection) { return connection.mockRespond(response); });
                userService.getUsersDetails().subscribe(function (_result) { return chai_1.expect(_result).to.be.deep.equal(result); }, function () { return chai_1.expect(true, 'should succeed').to.be.false; });
            });
        });
        testing_1.describe('getUsersDetailsByPartialUsername', function () {
            testing_1.it('without the user details result should fail correctly', function () {
                mockBackend.connections.subscribe(function (connection) { return connection.mockRespond(response); });
                userService.getUsersDetailsByPartialUsername('some username').subscribe(function () { return chai_1.expect(true, 'should fail').to.be.false; }, function (error) { return chai_1.expect(error).to.be.equal('Oops. Something went wrong. Please try again'); });
            });
            testing_1.it('with partial user details result should fail correctly', function () {
                var result = {
                    id: 1,
                    username: 'some username'
                };
                delete result.username;
                responseOptions = new http_2.ResponseOptions({
                    status: statusCode_1.StatusCode.OK,
                    headers: new http_1.Headers(),
                    body: [result]
                });
                response = new http_2.Response(responseOptions);
                mockBackend.connections.subscribe(function (connection) { return connection.mockRespond(response); });
                userService.getUsersDetailsByPartialUsername('some username').subscribe(function () { return chai_1.expect(true, 'should fail').to.be.false; }, function (error) { return chai_1.expect(error).to.be.equal('Oops. Something went wrong. Please try again'); });
            });
            testing_1.it('with the user details result and empty username should return fail correctly', function () {
                var result = {
                    id: 1,
                    username: '',
                };
                responseOptions = new http_2.ResponseOptions({
                    status: statusCode_1.StatusCode.OK,
                    headers: new http_1.Headers(),
                    body: [result]
                });
                response = new http_2.Response(responseOptions);
                mockBackend.connections.subscribe(function (connection) { return connection.mockRespond(response); });
                userService.getUsersDetailsByPartialUsername('some username').subscribe(function () { return chai_1.expect(true, 'should fail').to.be.false; }, function (error) { return chai_1.expect(error).to.be.equal('Oops. Something went wrong. Please try again'); });
            });
            testing_1.it('with the user details result and null id should return fail correctly', function () {
                var result = {
                    id: null,
                    username: 'some username',
                };
                responseOptions = new http_2.ResponseOptions({
                    status: statusCode_1.StatusCode.OK,
                    headers: new http_1.Headers(),
                    body: [result]
                });
                response = new http_2.Response(responseOptions);
                mockBackend.connections.subscribe(function (connection) { return connection.mockRespond(response); });
                userService.getUsersDetailsByPartialUsername('some username').subscribe(function () { return chai_1.expect(true, 'should fail').to.be.false; }, function (error) { return chai_1.expect(error).to.be.equal('Oops. Something went wrong. Please try again'); });
            });
            testing_1.it('with the user details result should return correct value', function () {
                var result = [
                    {
                        id: 1,
                        username: 'some username',
                    },
                    {
                        id: 2,
                        username: 'some other username',
                    }
                ];
                responseOptions = new http_2.ResponseOptions({
                    status: statusCode_1.StatusCode.OK,
                    headers: new http_1.Headers(),
                    body: result
                });
                response = new http_2.Response(responseOptions);
                mockBackend.connections.subscribe(function (connection) { return connection.mockRespond(response); });
                userService.getUsersDetailsByPartialUsername('some username').subscribe(function (_result) { return chai_1.expect(_result).to.be.deep.equal(result); }, function () { return chai_1.expect(true, 'should succeed').to.be.false; });
            });
        });
        testing_1.describe('getUserPermissions', function () {
            testing_1.it('without the permissions result getUserPermissions should fail correctly', function () {
                mockBackend.connections.subscribe(function (connection) { return connection.mockRespond(response); });
                userService.getUserPermissions(1).subscribe(function () { return chai_1.expect(true, 'should fail').to.be.false; }, function (error) { return chai_1.expect(error).to.be.equal('Oops. Something went wrong. Please try again'); });
            });
            testing_1.it('with empty user permissions result getUserPermissions should return correct value', function () {
                var result = [];
                responseOptions = new http_2.ResponseOptions({
                    status: statusCode_1.StatusCode.OK,
                    headers: new http_1.Headers(),
                    body: result
                });
                response = new http_2.Response(responseOptions);
                mockBackend.connections.subscribe(function (connection) { return connection.mockRespond(response); });
                userService.getUserPermissions(1).subscribe(function (_result) { return chai_1.expect(_result).to.be.deep.equal(result); }, function () { return chai_1.expect(true, 'should succeed').to.be.false; });
            });
            testing_1.it('with the user permissions result getUserPermissions should return correct value', function () {
                var result = [
                    { value: 0, name: 'a', description: 'a description' },
                    { value: 1, name: 'b', description: 'b description' },
                    { value: 2, name: 'c', description: 'c description' }
                ];
                responseOptions = new http_2.ResponseOptions({
                    status: statusCode_1.StatusCode.OK,
                    headers: new http_1.Headers(),
                    body: result
                });
                response = new http_2.Response(responseOptions);
                mockBackend.connections.subscribe(function (connection) { return connection.mockRespond(response); });
                userService.getUserPermissions(1).subscribe(function (_result) { return chai_1.expect(_result).to.be.deep.equal(result); }, function () { return chai_1.expect(true, 'should succeed').to.be.false; });
            });
        });
        testing_1.describe('getUserPermissionsModificationRules', function () {
            testing_1.it('without the permissions rules result getUserPermissionsModificationRules should fail correctly', function () {
                mockBackend.connections.subscribe(function (connection) { return connection.mockRespond(response); });
                userService.getUserPermissionsModificationRules().subscribe(function () { return chai_1.expect(true, 'should fail').to.be.false; }, function (error) { return chai_1.expect(error).to.be.equal('Oops. Something went wrong. Please try again'); });
            });
            testing_1.it('with empty user permissions rules result getUserPermissionsModificationRules should return correct value', function () {
                var result = [];
                responseOptions = new http_2.ResponseOptions({
                    status: statusCode_1.StatusCode.OK,
                    headers: new http_1.Headers(),
                    body: result
                });
                response = new http_2.Response(responseOptions);
                mockBackend.connections.subscribe(function (connection) { return connection.mockRespond(response); });
                userService.getUserPermissionsModificationRules().subscribe(function (_result) { return chai_1.expect(_result).to.be.deep.equal(result); }, function () { return chai_1.expect(true, 'should succeed').to.be.false; });
            });
            testing_1.it('with the user permissions rules result getUserPermissionsModificationRules should return correct value', function () {
                var result = [
                    { value: 0, name: 'a', description: 'a description', allowedToChange: true },
                    { value: 1, name: 'b', description: 'b description', allowedToChange: false },
                    { value: 2, name: 'c', description: 'c description', allowedToChange: true }
                ];
                responseOptions = new http_2.ResponseOptions({
                    status: statusCode_1.StatusCode.OK,
                    headers: new http_1.Headers(),
                    body: result
                });
                response = new http_2.Response(responseOptions);
                mockBackend.connections.subscribe(function (connection) { return connection.mockRespond(response); });
                userService.getUserPermissionsModificationRules().subscribe(function (_result) { return chai_1.expect(_result).to.be.deep.equal(result); }, function () { return chai_1.expect(true, 'should succeed').to.be.false; });
            });
        });
        testing_1.it('updateUserPermissions should succeed', function () {
            mockBackend.connections.subscribe(function (connection) { return connection.mockRespond(response); });
            var wasResolved = false;
            userService.updateUserPermissions(1, [], []).subscribe(function () { wasResolved = true; }, function () { return chai_1.expect(true, 'should succeed').to.be.false; });
            chai_1.expect(wasResolved).to.be.true;
        });
        testing_1.describe('canUserModifyTeams', function () {
            testing_1.it('without the expected result canUserModifyTeams should fail correctly', function () {
                mockBackend.connections.subscribe(function (connection) { return connection.mockRespond(response); });
                userService.canUserModifyTeams().subscribe(function () { return chai_1.expect(true, 'should fail').to.be.false; }, function (error) { return chai_1.expect(error).to.be.equal('Oops. Something went wrong. Please try again'); });
            });
            testing_1.it('with the expected result canUserModifyTeams should return correct value', function () {
                var result = true;
                responseOptions = new http_2.ResponseOptions({
                    status: statusCode_1.StatusCode.OK,
                    headers: new http_1.Headers(),
                    body: { canModifyTeamsList: result }
                });
                response = new http_2.Response(responseOptions);
                mockBackend.connections.subscribe(function (connection) { return connection.mockRespond(response); });
                userService.canUserModifyTeams().subscribe(function (_result) { return chai_1.expect(_result).to.be.equal(result); }, function () { return chai_1.expect(true, 'should succeed').to.be.false; });
            });
        });
        testing_1.describe('getTeamModificationPermissions', function () {
            testing_1.it('without the permissions result should fail correctly', function () {
                mockBackend.connections.subscribe(function (connection) { return connection.mockRespond(response); });
                userService.getTeamModificationPermissions(1).subscribe(function () { return chai_1.expect(true, 'should fail').to.be.false; }, function (error) { return chai_1.expect(error).to.be.equal('Oops. Something went wrong. Please try again'); });
            });
            testing_1.it('with the permissions result without canModifyTeamName should fail correctly', function () {
                var result = {
                    canModifyTeamName: true,
                    canModifyTeamAdmins: false,
                    canModifyTeamUsers: true
                };
                delete result.canModifyTeamName;
                responseOptions = new http_2.ResponseOptions({
                    status: statusCode_1.StatusCode.OK,
                    headers: new http_1.Headers(),
                    body: result
                });
                response = new http_2.Response(responseOptions);
                mockBackend.connections.subscribe(function (connection) { return connection.mockRespond(response); });
                userService.getTeamModificationPermissions(1).subscribe(function () { return chai_1.expect(true, 'should fail').to.be.false; }, function (error) { return chai_1.expect(error).to.be.equal('Oops. Something went wrong. Please try again'); });
            });
            testing_1.it('with the permissions result without canModifyTeamAdmins should fail correctly', function () {
                var result = {
                    canModifyTeamName: true,
                    canModifyTeamAdmins: false,
                    canModifyTeamUsers: true
                };
                delete result.canModifyTeamAdmins;
                responseOptions = new http_2.ResponseOptions({
                    status: statusCode_1.StatusCode.OK,
                    headers: new http_1.Headers(),
                    body: result
                });
                response = new http_2.Response(responseOptions);
                mockBackend.connections.subscribe(function (connection) { return connection.mockRespond(response); });
                userService.getTeamModificationPermissions(1).subscribe(function () { return chai_1.expect(true, 'should fail').to.be.false; }, function (error) { return chai_1.expect(error).to.be.equal('Oops. Something went wrong. Please try again'); });
            });
            testing_1.it('with the permissions result without canModifyTeamUsers should fail correctly', function () {
                var result = {
                    canModifyTeamName: true,
                    canModifyTeamAdmins: false,
                    canModifyTeamUsers: true
                };
                delete result.canModifyTeamUsers;
                responseOptions = new http_2.ResponseOptions({
                    status: statusCode_1.StatusCode.OK,
                    headers: new http_1.Headers(),
                    body: result
                });
                response = new http_2.Response(responseOptions);
                mockBackend.connections.subscribe(function (connection) { return connection.mockRespond(response); });
                userService.getTeamModificationPermissions(1).subscribe(function () { return chai_1.expect(true, 'should fail').to.be.false; }, function (error) { return chai_1.expect(error).to.be.equal('Oops. Something went wrong. Please try again'); });
            });
            testing_1.it('with the permissions result should return correct value', function () {
                var result = {
                    canModifyTeamName: true,
                    canModifyTeamAdmins: false,
                    canModifyTeamUsers: true
                };
                responseOptions = new http_2.ResponseOptions({
                    status: statusCode_1.StatusCode.OK,
                    headers: new http_1.Headers(),
                    body: result
                });
                response = new http_2.Response(responseOptions);
                mockBackend.connections.subscribe(function (connection) { return connection.mockRespond(response); });
                userService.getTeamModificationPermissions(1).subscribe(function (_result) { return chai_1.expect(_result).to.be.deep.equal(result); }, function () { return chai_1.expect(true, 'should succeed').to.be.false; });
            });
        });
    });
});
//# sourceMappingURL=userService.test.js.map