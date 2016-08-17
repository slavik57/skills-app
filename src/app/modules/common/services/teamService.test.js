"use strict";
var httpError_1 = require("../errors/httpError");
var statusCode_1 = require("../../../../common/statusCode");
var testing_1 = require('@angular/core/testing');
var http_1 = require('@angular/http');
var core_1 = require('@angular/core');
var testing_2 = require('@angular/http/testing');
var http_2 = require('@angular/http');
var chai_1 = require('chai');
var teamService_1 = require('./teamService');
testing_1.describe('TeamService', function () {
    var teamService;
    var mockBackend;
    testing_1.beforeEachProviders(function () { return [
        http_1.HTTP_PROVIDERS,
        testing_2.MockBackend,
        core_1.provide(http_1.XHRBackend, { useExisting: testing_2.MockBackend }),
        teamService_1.TeamService
    ]; });
    testing_1.beforeEach(testing_1.inject([testing_2.MockBackend, teamService_1.TeamService], function (_mockBackend, _teamService) {
        teamService = _teamService;
        mockBackend = _mockBackend;
    }));
    testing_1.it('getTeamsDetails should use correct url', function () {
        teamService.getTeamsDetails();
        chai_1.expect(mockBackend.connectionsArray).to.be.length(1);
        chai_1.expect(mockBackend.connectionsArray[0].request.method).to.be.equal(http_1.RequestMethod.Get);
        chai_1.expect(mockBackend.connectionsArray[0].request.url).to.be.equal('/api/teams/');
    });
    testing_1.it('isTeamExists should use correct url', function () {
        var teamName = 'some team name';
        teamService.isTeamExists(teamName);
        chai_1.expect(mockBackend.connectionsArray).to.be.length(1);
        chai_1.expect(mockBackend.connectionsArray[0].request.method).to.be.equal(http_1.RequestMethod.Get);
        chai_1.expect(mockBackend.connectionsArray[0].request.url).to.be.equal('/api/teams/' + teamName + '/exists');
    });
    testing_1.describe('createTeam', function () {
        var teamName;
        testing_1.beforeEach(function () {
            teamName = 'some team name';
            teamService.createTeam(teamName);
        });
        testing_1.it('should use correct url', function () {
            chai_1.expect(mockBackend.connectionsArray).to.be.length(1);
            chai_1.expect(mockBackend.connectionsArray[0].request.method).to.be.equal(http_1.RequestMethod.Post);
            chai_1.expect(mockBackend.connectionsArray[0].request.url).to.be.equal('/api/teams/');
        });
        testing_1.it('should use correct body', function () {
            var expectedBody = JSON.stringify({
                name: teamName
            });
            chai_1.expect(mockBackend.connectionsArray[0].request.getBody()).to.be.equal(expectedBody);
        });
    });
    testing_1.it('deleteTeam should use correct url', function () {
        var teamId = 123;
        teamService.deleteTeam(teamId);
        chai_1.expect(mockBackend.connectionsArray).to.be.length(1);
        chai_1.expect(mockBackend.connectionsArray[0].request.method).to.be.equal(http_1.RequestMethod.Delete);
        chai_1.expect(mockBackend.connectionsArray[0].request.url).to.be.equal('/api/teams/' + teamId);
    });
    testing_1.describe('updateTeamName', function () {
        var teamId;
        var newTeamName;
        testing_1.beforeEach(function () {
            teamId = 1234321;
            newTeamName = 'new team name';
            teamService.updateTeamName(teamId, newTeamName);
        });
        testing_1.it('should use correct url', function () {
            chai_1.expect(mockBackend.connectionsArray).to.be.length(1);
            chai_1.expect(mockBackend.connectionsArray[0].request.method).to.be.equal(http_1.RequestMethod.Put);
            chai_1.expect(mockBackend.connectionsArray[0].request.url).to.be.equal('/api/teams/' + teamId);
        });
        testing_1.it('should use correct body', function () {
            var expectedBody = JSON.stringify({
                name: newTeamName
            });
            chai_1.expect(mockBackend.connectionsArray[0].request.getBody()).to.be.equal(expectedBody);
        });
    });
    testing_1.it('getTeamMembers should use correct url', function () {
        var teamId = 123321;
        teamService.getTeamMembers(teamId);
        chai_1.expect(mockBackend.connectionsArray).to.be.length(1);
        chai_1.expect(mockBackend.connectionsArray[0].request.method).to.be.equal(http_1.RequestMethod.Get);
        chai_1.expect(mockBackend.connectionsArray[0].request.url).to.be.equal('/api/teams/' + teamId + '/members');
    });
    testing_1.describe('addTeamMember', function () {
        var teamId;
        var username;
        testing_1.beforeEach(function () {
            teamId = 789;
            username = 'some username';
            teamService.addTeamMember(teamId, username);
        });
        testing_1.it('should use correct url', function () {
            chai_1.expect(mockBackend.connectionsArray).to.be.length(1);
            chai_1.expect(mockBackend.connectionsArray[0].request.method).to.be.equal(http_1.RequestMethod.Post);
            chai_1.expect(mockBackend.connectionsArray[0].request.url).to.be.equal('/api/teams/' + teamId + '/members');
        });
        testing_1.it('should use correct body', function () {
            var expectedBody = JSON.stringify({
                username: username
            });
            chai_1.expect(mockBackend.connectionsArray[0].request.getBody()).to.be.equal(expectedBody);
        });
    });
    function shouldFaildWithError(error, beforeEachFunc) {
        return function () {
            testing_1.beforeEach(beforeEachFunc);
            testing_1.it('getTeamsDetails should fail correctly', function () {
                teamService.getTeamsDetails().subscribe(function () { return chai_1.expect(true, 'should fail').to.be.false; }, function (error) { return chai_1.expect(error).to.be.equal(error); });
            });
            testing_1.it('isTeamExists should fail correctly', function () {
                teamService.isTeamExists('some team name').subscribe(function () { return chai_1.expect(true, 'should fail').to.be.false; }, function (error) { return chai_1.expect(error).to.be.equal(error); });
            });
            testing_1.it('createTeam should fail correctly', function () {
                teamService.createTeam('').subscribe(function () { return chai_1.expect(true, 'should fail').to.be.false; }, function (error) { return chai_1.expect(error).to.be.equal(error); });
            });
            testing_1.it('deleteTeam should fail correctly', function () {
                teamService.deleteTeam(123).subscribe(function () { return chai_1.expect(true, 'should fail').to.be.false; }, function (error) { return chai_1.expect(error).to.be.equal(error); });
            });
            testing_1.it('updateTeamName should fail correctly', function () {
                teamService.updateTeamName(123, 'new team name').subscribe(function () { return chai_1.expect(true, 'should fail').to.be.false; }, function (error) { return chai_1.expect(error).to.be.equal(error); });
            });
            testing_1.it('addTeamMember should fail correctly', function () {
                teamService.addTeamMember(1, '').subscribe(function () { return chai_1.expect(true, 'should fail').to.be.false; }, function (error) { return chai_1.expect(error).to.be.equal(error); });
            });
        };
    }
    testing_1.describe('on UNAUTHORIZED error', shouldFaildWithError('Unauthorized', function () {
        var error = new httpError_1.HttpError();
        error.status = statusCode_1.StatusCode.UNAUTHORIZED;
        mockBackend.connections.subscribe(function (connection) { return connection.mockError(error); });
    }));
    testing_1.describe('on INTERNAL_SERVER_ERROR error', shouldFaildWithError('Oops. Something went wrong. Please try again', function () {
        var error = new httpError_1.HttpError();
        error.status = statusCode_1.StatusCode.INTERNAL_SERVER_ERROR;
        mockBackend.connections.subscribe(function (connection) { return connection.mockError(error); });
    }));
    testing_1.describe('on error with failing json method', shouldFaildWithError('Oops. Something went wrong. Please try again', function () {
        var error = new httpError_1.HttpError();
        error.json = function () { throw 'fail to parse'; };
        error.status = statusCode_1.StatusCode.NOT_FOUND;
        mockBackend.connections.subscribe(function (connection) { return connection.mockError(error); });
    }));
    testing_1.describe('on error with failing json method', shouldFaildWithError('Oops. Something went wrong. Please try again', function () {
        var responseOptions = new http_2.ResponseOptions({
            status: statusCode_1.StatusCode.UNAUTHORIZED
        });
        var response = new http_2.Response(responseOptions);
        mockBackend.connections.subscribe(function (connection) { return connection.mockRespond(response); });
    }));
    testing_1.describe('on error with error description', function () {
        var reasonForError;
        testing_1.beforeEach(function () {
            reasonForError = 'some reason';
            var error = new httpError_1.HttpError();
            error.body = { error: reasonForError };
            mockBackend.connections.subscribe(function (connection) { return connection.mockError(error); });
        });
        testing_1.it('createTeam should fail correctly', function () {
            teamService.createTeam('').subscribe(function () { return chai_1.expect(true, 'should fail').to.be.false; }, function (error) { return chai_1.expect(error).to.be.equal(reasonForError); });
        });
        testing_1.it('addTeamMember should fail correctly', function () {
            teamService.addTeamMember(1, '').subscribe(function () { return chai_1.expect(true, 'should fail').to.be.false; }, function (error) { return chai_1.expect(error).to.be.equal(reasonForError); });
        });
    });
    testing_1.describe('on success with OK', function () {
        var responseOptions;
        testing_1.beforeEach(function () {
            responseOptions = new http_2.ResponseOptions({
                status: statusCode_1.StatusCode.OK,
                headers: new http_1.Headers()
            });
        });
        testing_1.describe('getTeamsDetails', function () {
            testing_1.it('without the teams details result getTeamsDetails should fail correctly', function () {
                mockBackend.connections.subscribe(function (connection) { return connection.mockRespond(new http_2.Response(responseOptions)); });
                teamService.getTeamsDetails().subscribe(function () { return chai_1.expect(true, 'should fail').to.be.false; }, function (error) { return chai_1.expect(error).to.be.equal('Oops. Something went wrong. Please try again'); });
            });
            testing_1.it('with partial teams details result getTeamsDetails should fail correctly', function () {
                var result = {
                    id: 1,
                    teamName: 'some username'
                };
                delete result.teamName;
                responseOptions = new http_2.ResponseOptions({
                    status: statusCode_1.StatusCode.OK,
                    headers: new http_1.Headers(),
                    body: [result]
                });
                var response = new http_2.Response(responseOptions);
                mockBackend.connections.subscribe(function (connection) { return connection.mockRespond(response); });
                teamService.getTeamsDetails().subscribe(function () { return chai_1.expect(true, 'should fail').to.be.false; }, function (error) { return chai_1.expect(error).to.be.equal('Oops. Something went wrong. Please try again'); });
            });
            testing_1.it('with the teams details result and empty teamName getTeamsDetails should fail correctly', function () {
                var result = {
                    id: 1,
                    teamName: '',
                };
                responseOptions = new http_2.ResponseOptions({
                    status: statusCode_1.StatusCode.OK,
                    headers: new http_1.Headers(),
                    body: [result]
                });
                var response = new http_2.Response(responseOptions);
                mockBackend.connections.subscribe(function (connection) { return connection.mockRespond(response); });
                teamService.getTeamsDetails().subscribe(function () { return chai_1.expect(true, 'should fail').to.be.false; }, function (error) { return chai_1.expect(error).to.be.equal('Oops. Something went wrong. Please try again'); });
            });
            testing_1.it('with the teams details result and null id getTeamsDetails should return fail correctly', function () {
                var result = {
                    id: null,
                    teamName: 'some team name',
                };
                responseOptions = new http_2.ResponseOptions({
                    status: statusCode_1.StatusCode.OK,
                    headers: new http_1.Headers(),
                    body: [result]
                });
                var response = new http_2.Response(responseOptions);
                mockBackend.connections.subscribe(function (connection) { return connection.mockRespond(response); });
                teamService.getTeamsDetails().subscribe(function () { return chai_1.expect(true, 'should fail').to.be.false; }, function (error) { return chai_1.expect(error).to.be.equal('Oops. Something went wrong. Please try again'); });
            });
            testing_1.it('with the teams details result getTeamsDetails should return correct value', function () {
                var result = [
                    {
                        id: 1,
                        teamName: 'some team name',
                    },
                    {
                        id: 2,
                        teamName: 'some other team name',
                    }
                ];
                responseOptions = new http_2.ResponseOptions({
                    status: statusCode_1.StatusCode.OK,
                    headers: new http_1.Headers(),
                    body: result
                });
                var response = new http_2.Response(responseOptions);
                mockBackend.connections.subscribe(function (connection) { return connection.mockRespond(response); });
                teamService.getTeamsDetails().subscribe(function (_result) { return chai_1.expect(_result).to.be.deep.equal(result); }, function () { return chai_1.expect(true, 'should succeed').to.be.false; });
            });
        });
        testing_1.describe('isTeamExists', function () {
            testing_1.it('without the team existance result isTeamExists should fail correctly', function () {
                mockBackend.connections.subscribe(function (connection) { return connection.mockRespond(new http_2.Response(responseOptions)); });
                teamService.isTeamExists('').subscribe(function () { return chai_1.expect(true, 'should fail').to.be.false; }, function (error) { return chai_1.expect(error).to.be.equal('Oops. Something went wrong. Please try again'); });
            });
            testing_1.it('with the team existance result isTeamExists should return correct value', function () {
                var result = true;
                responseOptions = new http_2.ResponseOptions({
                    status: statusCode_1.StatusCode.OK,
                    headers: new http_1.Headers(),
                    body: { teamExists: result }
                });
                var response = new http_2.Response(responseOptions);
                mockBackend.connections.subscribe(function (connection) { return connection.mockRespond(response); });
                teamService.isTeamExists('').subscribe(function (_result) { return chai_1.expect(_result).to.be.equal(result); }, function () { return chai_1.expect(true, 'should succeed').to.be.false; });
            });
        });
        testing_1.describe('createTeam', function () {
            testing_1.describe('without team details', function () {
                testing_1.beforeEach(function () {
                    mockBackend.connections.subscribe(function (connection) { return connection.mockRespond(new http_2.Response(responseOptions)); });
                });
                testing_1.it('createTeam should fail correctly', function () {
                    teamService.createTeam('').subscribe(function () { return chai_1.expect(true, 'should fail').to.be.false; }, function (error) { return chai_1.expect(error).to.be.equal('Oops. Something went wrong. Please try again'); });
                });
            });
            testing_1.describe('with team details', function () {
                var teamDetails;
                testing_1.beforeEach(function () {
                    teamDetails = {
                        teamName: 'some team name',
                        id: 1234
                    };
                    responseOptions.body = teamDetails;
                    var response = new http_2.Response(responseOptions);
                    mockBackend.connections.subscribe(function (connection) { return connection.mockRespond(response); });
                });
                testing_1.it('crateTeam should return correct team details', function () {
                    teamService.createTeam('').subscribe(function (_details) { return chai_1.expect(_details).to.deep.equal(teamDetails); }, function () { return chai_1.expect(true, 'should succeed').to.be.false; });
                });
            });
        });
        testing_1.describe('deleteTeam', function () {
            testing_1.it('should succeed', function () {
                var result = true;
                responseOptions = new http_2.ResponseOptions({
                    status: statusCode_1.StatusCode.OK,
                    headers: new http_1.Headers(),
                });
                var response = new http_2.Response(responseOptions);
                mockBackend.connections.subscribe(function (connection) { return connection.mockRespond(response); });
                var wasResolved = false;
                teamService.deleteTeam(1234).subscribe(function () { return wasResolved = true; }, function () { return chai_1.expect(true, 'should succeed').to.be.false; });
                chai_1.expect(wasResolved).to.be.true;
            });
        });
        testing_1.describe('updateTeamName', function () {
            testing_1.describe('without team details', function () {
                testing_1.beforeEach(function () {
                    mockBackend.connections.subscribe(function (connection) { return connection.mockRespond(new http_2.Response(responseOptions)); });
                });
                testing_1.it('should fail correctly', function () {
                    teamService.updateTeamName(123, 'new team name').subscribe(function () { return chai_1.expect(true, 'should fail').to.be.false; }, function (error) { return chai_1.expect(error).to.be.equal('Oops. Something went wrong. Please try again'); });
                });
            });
            testing_1.describe('with team details', function () {
                var teamDetails;
                testing_1.beforeEach(function () {
                    teamDetails = {
                        teamName: 'some team name',
                        id: 1234
                    };
                    responseOptions.body = teamDetails;
                    var response = new http_2.Response(responseOptions);
                    mockBackend.connections.subscribe(function (connection) { return connection.mockRespond(response); });
                });
                testing_1.it('should return correct team details', function () {
                    teamService.updateTeamName(teamDetails.id, teamDetails.teamName).subscribe(function (_details) { return chai_1.expect(_details).to.deep.equal(teamDetails); }, function () { return chai_1.expect(true, 'should succeed').to.be.false; });
                });
            });
        });
        testing_1.describe('getTeamMembers', function () {
            testing_1.it('without the users details result should fail correctly', function () {
                mockBackend.connections.subscribe(function (connection) { return connection.mockRespond(new http_2.Response(responseOptions)); });
                teamService.getTeamMembers(123).subscribe(function () { return chai_1.expect(true, 'should fail').to.be.false; }, function (error) { return chai_1.expect(error).to.be.equal('Oops. Something went wrong. Please try again'); });
            });
            testing_1.it('without username should fail correctly', function () {
                var result = {
                    id: 1,
                    username: 'some username',
                    isAdmin: true
                };
                delete result.username;
                responseOptions = new http_2.ResponseOptions({
                    status: statusCode_1.StatusCode.OK,
                    headers: new http_1.Headers(),
                    body: [result]
                });
                var response = new http_2.Response(responseOptions);
                mockBackend.connections.subscribe(function (connection) { return connection.mockRespond(response); });
                teamService.getTeamMembers(12321).subscribe(function () { return chai_1.expect(true, 'should fail').to.be.false; }, function (error) { return chai_1.expect(error).to.be.equal('Oops. Something went wrong. Please try again'); });
            });
            testing_1.it('without id should fail correctly', function () {
                var result = {
                    id: 1,
                    username: 'some username',
                    isAdmin: true
                };
                delete result.id;
                responseOptions = new http_2.ResponseOptions({
                    status: statusCode_1.StatusCode.OK,
                    headers: new http_1.Headers(),
                    body: [result]
                });
                var response = new http_2.Response(responseOptions);
                mockBackend.connections.subscribe(function (connection) { return connection.mockRespond(response); });
                teamService.getTeamMembers(12321).subscribe(function () { return chai_1.expect(true, 'should fail').to.be.false; }, function (error) { return chai_1.expect(error).to.be.equal('Oops. Something went wrong. Please try again'); });
            });
            testing_1.it('without isAdmin should fail correctly', function () {
                var result = {
                    id: 1,
                    username: 'some username',
                    isAdmin: true
                };
                delete result.isAdmin;
                responseOptions = new http_2.ResponseOptions({
                    status: statusCode_1.StatusCode.OK,
                    headers: new http_1.Headers(),
                    body: [result]
                });
                var response = new http_2.Response(responseOptions);
                mockBackend.connections.subscribe(function (connection) { return connection.mockRespond(response); });
                teamService.getTeamMembers(12321).subscribe(function () { return chai_1.expect(true, 'should fail').to.be.false; }, function (error) { return chai_1.expect(error).to.be.equal('Oops. Something went wrong. Please try again'); });
            });
            testing_1.it('with the users details result and empty username should fail correctly', function () {
                var result = {
                    id: 1,
                    username: '',
                    isAdmin: true
                };
                responseOptions = new http_2.ResponseOptions({
                    status: statusCode_1.StatusCode.OK,
                    headers: new http_1.Headers(),
                    body: [result]
                });
                var response = new http_2.Response(responseOptions);
                mockBackend.connections.subscribe(function (connection) { return connection.mockRespond(response); });
                teamService.getTeamMembers(12321).subscribe(function () { return chai_1.expect(true, 'should fail').to.be.false; }, function (error) { return chai_1.expect(error).to.be.equal('Oops. Something went wrong. Please try again'); });
            });
            testing_1.it('with the users details result and null id should return fail correctly', function () {
                var result = {
                    id: null,
                    username: 'some username',
                    isAdmin: true
                };
                responseOptions = new http_2.ResponseOptions({
                    status: statusCode_1.StatusCode.OK,
                    headers: new http_1.Headers(),
                    body: [result]
                });
                var response = new http_2.Response(responseOptions);
                mockBackend.connections.subscribe(function (connection) { return connection.mockRespond(response); });
                teamService.getTeamMembers(11).subscribe(function () { return chai_1.expect(true, 'should fail').to.be.false; }, function (error) { return chai_1.expect(error).to.be.equal('Oops. Something went wrong. Please try again'); });
            });
            testing_1.it('with the users details result should return correct value', function () {
                var result = [
                    {
                        id: 1,
                        username: 'some username',
                        isAdmin: true
                    },
                    {
                        id: 2,
                        username: 'some other username',
                        isAdmin: false
                    }
                ];
                responseOptions = new http_2.ResponseOptions({
                    status: statusCode_1.StatusCode.OK,
                    headers: new http_1.Headers(),
                    body: result
                });
                var response = new http_2.Response(responseOptions);
                mockBackend.connections.subscribe(function (connection) { return connection.mockRespond(response); });
                teamService.getTeamMembers(111).subscribe(function (_result) { return chai_1.expect(_result).to.be.deep.equal(result); }, function () { return chai_1.expect(true, 'should succeed').to.be.false; });
            });
        });
        testing_1.describe('addTeamMember', function () {
            testing_1.describe('without team member details', function () {
                testing_1.beforeEach(function () {
                    mockBackend.connections.subscribe(function (connection) { return connection.mockRespond(new http_2.Response(responseOptions)); });
                });
                testing_1.it('should fail correctly', function () {
                    teamService.addTeamMember(1, '').subscribe(function () { return chai_1.expect(true, 'should fail').to.be.false; }, function (error) { return chai_1.expect(error).to.be.equal('Oops. Something went wrong. Please try again'); });
                });
            });
            testing_1.describe('with team member details', function () {
                var teamMemberDetails;
                testing_1.beforeEach(function () {
                    teamMemberDetails = {
                        id: 1234,
                        username: 'some username',
                        isAdmin: true
                    };
                    responseOptions.body = teamMemberDetails;
                    var response = new http_2.Response(responseOptions);
                    mockBackend.connections.subscribe(function (connection) { return connection.mockRespond(response); });
                });
                testing_1.it('should return correct team details', function () {
                    teamService.addTeamMember(1, '').subscribe(function (_details) { return chai_1.expect(_details).to.deep.equal(teamMemberDetails); }, function () { return chai_1.expect(true, 'should succeed').to.be.false; });
                });
            });
        });
    });
});
//# sourceMappingURL=teamService.test.js.map