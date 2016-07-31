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
    function shouldFaildWithError(error, beforeEachFunc) {
        return function () {
            testing_1.beforeEach(beforeEachFunc);
            testing_1.it('getTeamsDetails should fail correctly', function () {
                teamService.getTeamsDetails().subscribe(function () { return chai_1.expect(true, 'should fail').to.be.false; }, function (error) { return chai_1.expect(error).to.be.equal(error); });
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
        testing_1.describe('getTeamsDetails', function () {
            testing_1.it('without the teams details result getTeamsDetails should fail correctly', function () {
                mockBackend.connections.subscribe(function (connection) { return connection.mockRespond(response); });
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
                response = new http_2.Response(responseOptions);
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
                response = new http_2.Response(responseOptions);
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
                response = new http_2.Response(responseOptions);
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
                response = new http_2.Response(responseOptions);
                mockBackend.connections.subscribe(function (connection) { return connection.mockRespond(response); });
                teamService.getTeamsDetails().subscribe(function (_result) { return chai_1.expect(_result).to.be.deep.equal(result); }, function () { return chai_1.expect(true, 'should succeed').to.be.false; });
            });
        });
    });
});
//# sourceMappingURL=teamService.test.js.map